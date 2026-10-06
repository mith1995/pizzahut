from io import BytesIO

from django.conf import settings
from django.template.loader import render_to_string
from xhtml2pdf import pisa

def build_invoice_pdf(order):
    session = getattr(order, "payment_seesion", None)
    captured = None
    if session:
        captured = next(
            (a for a in session.attempts.all()
             if a.status in ("captured", "refunded")),
             None
        )

    html = render_to_string("orders/invoice.html", {
        "order": order,
        "address": order.shipping_address_snapshot or {},
        "company": settings.INVOICE_COMPANY,
        "transaction_id": captured.razorpay_payment_id if captured else None,
        "paid_at": session.paid_at if session else None,
    })

    buffer = BytesIO()
    result = pisa.CreatePDF(html, dest=buffer)
    if result.err:
        raise RuntimeError("Invoice PDF generation failed")
    return buffer.getvalue()