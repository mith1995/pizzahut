import AnchorButton from "../../../components/common/AnchorButton";
import FallbackImage from "../../../components/common/FallbackImage";
import { formatPrice, longDateFormat } from "../../../utils/helper";

const STATUS_CLASS = {
  pending: "tag warning",
  confirmed: "tag order-confirmed",
  shipped: "tag info",
  delivered: "tag success",
  cancelled: "tag order-cancelled-tag",
};

function OrderCard({ order }) {
  const statusClass = STATUS_CLASS[order.status] ?? "tag";

  return (
    <article className="live-order-card live-order-card-preview">
      <div className="live-order-card-heading">
        <div className="live-order-reference">
          <span className="section-eyebrow">SAMPLE ORDER</span>
          <h4>{`#OD-${order.id}`}</h4>
        </div>
        <span className={statusClass}>{order.status_display}</span>
      </div>
      <div className="live-order-summary">
        {
          <FallbackImage
            className="live-order-image"
            src={order?.product_image}
            alt={order.product_name}
          />
        }
        <div className="live-order-items">
          <strong>{order?.product_name}</strong>
          <span>{`${order.items_count} item`}</span>
        </div>
        <div className="live-order-total">
          <span>TOTAL</span>
          <strong className="price">
            {formatPrice(order.final_amount, order.currency_symbol)}
          </strong>
        </div>
      </div>
      <div className="live-order-card-footer">
        <span>
          <i className="fa fa-calendar-o" aria-hidden="true"></i>{" "}
          {`Placed ${longDateFormat(order.created_at)}`}
        </span>
        <AnchorButton
          className="button live-order-track-link"
          type="button"
          href={`/account/orders/${order.id}/`}
        >
          Preview only
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
        </AnchorButton>
      </div>
    </article>
  );
}

export default OrderCard;
