import { formatAddress, longDateFormat } from "../../../utils/helper";

const PAYMENT_STATUS = {
  created: { label: "Awaiting payment", tag: "", icon: "fa-clock-o" },
  attempted: { label: "Payment in progress", tag: "", icon: "fa-clock-o" },
  paid: {
    label: "Payment successful",
    tag: "success",
    icon: "fa-check-circle",
  },
  failed: { label: "Payment failed", tag: "danger", icon: "fa-times-circle" },
  expired: { label: "Payment expired", tag: "danger", icon: "fa-ban" },
  refunded: { label: "Refunded", tag: "", icon: "fa-undo" },
};

const METHOD_LABEL = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  wallet: "Wallet",
};

function PaymentSection({ order }) {
  const payment = order?.payment;
  const pStatus = payment ? PAYMENT_STATUS[payment.status] : null;
  const { street, region } = formatAddress(order?.shipping_address_snapshot);
  return (
    <section className="customer-panel payment-card">
      <span className="section-eyebrow">PAID SECURELY</span>
      <h3>
        <i className="fa fa-credit-card panel-heading-icon"></i> Payment details
      </h3>
      {payment ? (
        <>
          {payment.method && (
            <div className="payment-detail-row">
              <span>Payment method</span>
              <strong id="tracked-payment-method">
                {METHOD_LABEL[payment.method] ?? payment.method}
              </strong>
            </div>
          )}

          {payment.transaction_id && (
            <div className="payment-detail-row">
              <span>Transaction ID</span>
              <strong id="tracked-transaction">{payment.transaction_id}</strong>
            </div>
          )}

          <div className="payment-detail-row">
            <span>Billing address</span>
            <strong id="tracked-billing">
              {`${order.first_name} ${order.last_name}`}
              <br />
              {street}
              <br />
              {region}
            </strong>
          </div>
          {payment.paid_at && (
            <div className="payment-detail-row">
              <span>Paid on</span>
              <strong>{longDateFormat(payment.paid_at)}</strong>
            </div>
          )}
          <span className={`tag ${pStatus?.tag ?? ""}`}>
            <i className={`fa ${pStatus?.icon}`}></i>{" "}
            {pStatus?.label ?? payment.status}
          </span>
        </>
      ) : (
        <>
          <p>No payment has been started for this order.</p>
          <span className="tag">
            <i className="fa fa-clock-o"></i> Awaiting payment
          </span>
        </>
      )}
    </section>
  );
}

export default PaymentSection;
