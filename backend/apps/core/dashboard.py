import json
from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from apps.orders.models import Order, OrderItem, OrderReturn
from apps.payments.models import PaymentSession


def _money(value):
    return f"₹{(value or Decimal('0')):,.2f}"


def dashboard_callback(request, context):
    today = timezone.localdate()
    days = [today - timedelta(days=i) for i in range(6, -1, -1)]  # 7 din

    paid = PaymentSession.objects.filter(status="paid")

    # ---- KPI cards ----
    revenue_total = paid.aggregate(s=Sum("amount"))["s"]
    revenue_today = paid.filter(paid_at__date=today).aggregate(s=Sum("amount"))["s"]
    refunded_total = (
        PaymentSession.objects.filter(status="refunded").aggregate(s=Sum("amount"))["s"]
    )
    orders_today = Order.objects.filter(created_at__date=today).count()

    kpis = [
        {"title": "Revenue today", "value": _money(revenue_today)},
        {"title": "Total revenue", "value": _money(revenue_total)},
        {"title": "Orders today", "value": orders_today},
        {"title": "Refunded (full)", "value": _money(refunded_total)},
    ]

    # ---- Kaam jo admin ko abhi karna hai ----
    attention = [
        {
            "title": "Confirmed, waiting to ship",
            "value": Order.objects.filter(status="confirmed").count(),
            "url": reverse("admin:orders_order_changelist") + "?status__exact=confirmed",
        },
        {
            "title": "Return requests to review",
            "value": OrderReturn.objects.filter(status="requested").count(),
            "url": reverse("admin:orders_orderreturn_changelist") + "?status__exact=requested",
        },
        {
            "title": "Refunds to retry",
            "value": PaymentSession.objects.filter(status="refund_pending").count(),
            "url": reverse("admin:payments_paymentsession_changelist") + "?status__exact=refund_pending",
        },
        {
            "title": "Failed payments (24h)",
            "value": PaymentSession.objects.filter(
                status="failed", updated_at__gte=timezone.now() - timedelta(hours=24)
            ).count(),
            "url": reverse("admin:payments_paymentsession_changelist") + "?status__exact=failed",
        },
    ]

    # ---- Last 7 days chart ----
    revenue_by_day = {
        r["d"]: r["s"]
        for r in paid.filter(paid_at__date__gte=days[0])
        .annotate(d=TruncDate("paid_at"))
        .values("d")
        .annotate(s=Sum("amount"))
    }
    orders_by_day = {
        r["d"]: r["c"]
        for r in Order.objects.filter(created_at__date__gte=days[0])
        .annotate(d=TruncDate("created_at"))
        .values("d")
        .annotate(c=Count("id"))
    }

    revenue_chart = json.dumps({
        "labels": [d.strftime("%d %b") for d in days],
        "datasets": [{
            "label": "Revenue",
            "data": [float(revenue_by_day.get(d, 0)) for d in days],
            "backgroundColor": "var(--color-primary-500)",
        }],
    })
    orders_chart = json.dumps({
        "labels": [d.strftime("%d %b") for d in days],
        "datasets": [{
            "label": "Orders",
            "data": [orders_by_day.get(d, 0) for d in days],
            "backgroundColor": "var(--color-primary-500)",
        }],
    })

    # ---- Top products ----
    top = (
        OrderItem.objects.exclude(order__status__in=["pending", "cancelled", "returned"])
        .values("product_name")
        .annotate(qty=Sum("quantity"))
        .order_by("-qty")[:5]
    )
    top_products = {
        "headers": ["Product", "Sold"],
        "rows": [[t["product_name"], t["qty"]] for t in top],
    }

    # ---- Recent orders ----
    recent = Order.objects.select_related("payment_session").order_by("-created_at")[:8]
    recent_orders = {
        "headers": ["Order", "Customer", "Status", "Payment", "Amount"],
        "rows": [
            [
                format_html(
                    '<a href="{}">#OD-{}</a>',
                    reverse("admin:orders_order_change", args=[o.pk]),
                    o.pk,
                ),
                f"{o.first_name} {o.last_name}".strip() or o.email,
                o.get_status_display(),
                o.payment_session.status if hasattr(o, "payment_session") else "-",
                _money(o.final_amount),
            ]
            for o in recent
        ],
    }

    context.update({
        "kpis": kpis,
        "attention": attention,
        "revenue_chart": revenue_chart,
        "orders_chart": orders_chart,
        "top_products": top_products,
        "recent_orders": recent_orders,
    })
    return context