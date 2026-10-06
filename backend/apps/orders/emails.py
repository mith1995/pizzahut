import logging
import threading

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)

METHOD_LABEL = {"upi": "UPI", "card": "Card", "netbanking": "Net banking", "wallet": "Wallet"}

EMAIL_KINDS = {
    "confirmed": {
        "subject": "Order #OD-{id} confirmed",
        "html": "orders/emails/order_confirmed.html",
        "txt": "orders/emails/order_confirmed.txt",
        "attach_invoice": False,
    },
    "delivered": {
        "subject": "Order #OD-{id} delivered - your invoice",
        "html": "orders/emails/order_delivered.html",
        "txt": "orders/emails/order_delivered.txt",
        "attach_invoice": True,
    },
}


def _address_lines(snapshot):
    a = snapshot if isinstance(snapshot, dict) else {}
    street = ", ".join(p for p in [a.get("line1"), a.get("line2")] if p)
    city_state = ", ".join(p for p in [a.get("city"), a.get("state")] if p)
    region = " - ".join(p for p in [city_state, a.get("postal_code")] if p)
    return street, region


def _build_context(order):
    session = getattr(order, "payment_session", None)
    captured = None
    if session:
        captured = next(
            (a for a in session.attempts.all() if a.status in ("captured", "refunded")),
            None,
        )

    method = (captured.raw_response or {}).get("method") if captured else None
    street, region = _address_lines(order.shipping_address_snapshot)
    site_url = getattr(settings, "SITE_URL", "")

    return {
        "order": order,
        "currency_symbol": getattr(settings, "CURRENCY_SYMBOL", "₹"),
        "is_paid": bool(session and session.status == "paid"),
        "payment_method": METHOD_LABEL.get(method, method),
        "transaction_id": captured.razorpay_payment_id if captured else None,
        "paid_at": session.paid_at if session else None,
        "free_delivery": order.delivery_fee == 0,
        "has_discount": order.discount_amount > 0,
        "address_street": street,
        "address_region": region,
        "order_url": f"{site_url}/orders/{order.id}",
        "site_url": site_url,
        "support_email": getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL),
        "year": timezone.now().year,
    }


def send_order_email(order_id, kind):
    from apps.orders.models import Order

    cfg = EMAIL_KINDS[kind]
    try:
        order = (
            Order.objects.select_related("user", "payment_session")
            .prefetch_related("items", "payment_session__attempts")
            .get(pk=order_id)
        )

        recipient = order.email or order.user.email
        if not recipient:
            logger.warning("No email for order %s, '%s' email skipped", order_id, kind)
            return False

        context = _build_context(order)
        msg = EmailMultiAlternatives(
            subject=cfg["subject"].format(id=order.id),
            body=render_to_string(cfg["txt"], context),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
        )
        msg.attach_alternative(render_to_string(cfg["html"], context), "text/html")

        if cfg["attach_invoice"]:
            try:
                from apps.orders.invoice import build_invoice_pdf

                msg.attach(
                    f"invoice-OD-{order.id}.pdf",
                    build_invoice_pdf(order),
                    "application/pdf",
                )
            except Exception:
                logger.exception("Invoice PDF failed for order %s", order.pk)

        msg.send()
        return True
    except Exception:
        logger.exception("Email '%s' failed for order %s", kind, order_id)
        return False


def send_order_email_async(order_id, kind):
    threading.Thread(
        target=send_order_email, args=(order_id, kind), daemon=True
    ).start()