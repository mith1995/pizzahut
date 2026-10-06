import logging

import razorpay
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.payments.models import PaymentSession, PaymentAttempt

logger = logging.getLogger(__name__)


def get_razorpay_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

def to_paise(amount):
    return int((amount * 100).to_integral_value())


def _get_or_create_attempt(session, razorpay_order_id, razorpay_payment_id):
    if razorpay_payment_id:
        attempt, created = PaymentAttempt.objects.get_or_create(
            razorpay_payment_id=razorpay_payment_id,
            defaults={
                "payment_session": session,
                "razorpay_order_id": razorpay_order_id,
            },
        )
    else:
        attempt = PaymentAttempt(
            payment_session=session,
            razorpay_order_id=razorpay_order_id,
        )
        created = True
    return attempt, created


@transaction.atomic
def mark_payment_success(razorpay_order_id, razorpay_payment_id, signature=None, raw=None):
    session = (
        PaymentSession.objects.select_for_update()
        .select_related("order")
        .get(razorpay_order_id=razorpay_order_id)
    )

    attempt, created = _get_or_create_attempt(
        session, razorpay_order_id, razorpay_payment_id
    )
    if created:
        session.total_attempts += 1

    attempt.status = "captured"
    if signature:
        attempt.razorpay_signature = signature
    if raw:
        attempt.raw_response = raw
    attempt.save()

    # Duplicate webhook/verify call par kuch dobara mat karo
    if session.status in ("paid", "refunded", "refund_pending"):
        session.save()
        return session

    session.paid_at = timezone.now()
    order = session.order

    if order.status == "cancelled":
        # User ne cancel kar diya aur payment baad mein aa gayi:
        # order ko wapas confirm mat karo, paisa refund hona chahiye
        session.status = "refund_pending"
        logger.warning(
            "Payment captured for cancelled order %s, refund needed", order.pk
        )
    else:
        session.status = "paid"
        if order.status == "pending":
            order.status = "confirmed"
            order.save(update_fields=["status", "updated_at"])

    session.save()
    return session


@transaction.atomic
def mark_payment_failed(
    razorpay_order_id,
    razorpay_payment_id=None,
    code="",
    description="",
    raw=None,
):
    session = PaymentSession.objects.select_for_update().get(
        razorpay_order_id=razorpay_order_id
    )
    # Paid/refund wali session ko kabhi downgrade mat karo
    if session.status in ("paid", "refunded", "refund_pending"):
        return session

    attempt, created = _get_or_create_attempt(
        session, razorpay_order_id, razorpay_payment_id
    )
    if created:
        session.total_attempts += 1

    attempt.status = "failed"
    attempt.failure_code = code or None
    attempt.failure_description = description or None
    if raw:
        attempt.raw_response = raw
    attempt.save()

    # Cancelled order ki expired session "failed" na ban jaye
    if session.status != "expired":
        session.status = "failed"
    session.save()
    return session


def refund_payment(session, amount=None):
    if session.status not in ("paid", "refund_pending"):
        raise ValueError("This payment is not eligible for refund.")

    attempt = session.attempts.filter(status="captured").first()
    if not attempt:
        raise ValueError("No captured payment found to refund.")

    amount = amount or session.amount
    if amount > session.amount:
        raise ValueError("Refund amount cannot exceed the paid amount.")

    client = get_razorpay_client()
    refund = client.payment.refund(
        attempt.razorpay_payment_id,
        {"amount": to_paise(amount)},
    )

    with transaction.atomic():
        session = PaymentSession.objects.select_for_update().get(pk=session.pk)
        attempt = PaymentAttempt.objects.select_for_update().get(pk=attempt.pk)

        raw = dict(attempt.raw_response or {})
        raw.setdefault("refunds", []).append(refund)
        attempt.raw_response = raw

        if amount == session.amount:
            session.status = "refunded"
            attempt.status = "refunded"
            session.save(update_fields=["status", "updated_at"])
            attempt.save(update_fields=["status", "raw_response", "updated_at"])
        else:
            attempt.save(update_fields=["raw_response", "updated_at"])

    return refund