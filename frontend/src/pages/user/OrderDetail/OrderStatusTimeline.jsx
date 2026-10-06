const STATUS_STEPS = [
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_INFO = {
  pending: {
    title: "Order placed",
    description: "We're waiting for payment confirmation.",
    icon: "fa-clock-o",
  },
  confirmed: {
    title: "Order confirmed",
    description: "We've received your order and are getting it ready.",
    icon: "fa-check",
  },
  shipped: {
    title: "Order shipped",
    description: "Your order is on its way.",
    icon: "fa-truck",
  },
  out_for_delivery: {
    title: "Out for delivery",
    description: "Your order will reach you today.",
    icon: "fa-truck",
  },
  delivered: {
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: "fa-check",
  },
  cancelled: {
    title: "Order cancelled",
    description: "This order was cancelled.",
    icon: "fa-times",
  },
};
function OrderStatusTimeline({ status, statusDisplay }) {
  const info = STATUS_INFO[status] ?? STATUS_INFO.pending;
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const showTimeline = !["pending", "cancelled"].includes(status);
  return (
    <section
      className="customer-panel order-status-panel"
      id="tracking"
      aria-label="Order status"
      data-order-status={status}
    >
      <div className="order-status-heading">
        <div className="order-status-icon">
          <i className={`fa ${info.icon}`}></i>
        </div>
        <div>
          <span className="tag order-current-status">
            {statusDisplay && status}
          </span>
          <h3 className="order-status-title">{info.title}</h3>
          <p className="order-status-description">{info.description}</p>
        </div>
      </div>
      {showTimeline && (
        <ol className="order-timeline" aria-label="Order progress">
          {STATUS_STEPS.map((step, i) => (
            <li
              data-status-step="confirmed"
              key={i}
              className={i <= currentIndex ? "complete" : ""}
            >
              <span>
                <i className={`fa ${STATUS_INFO[step.key].icon}`}></i>
              </span>
              <strong>{step.label}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default OrderStatusTimeline;
