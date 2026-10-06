import FallbackImage from "../../../components/common/FallbackImage";
import { formatPrice } from "../../../utils/helper";

function OrderProductCard({ item }) {
  return (
    <article className="data-row order-product">
      <FallbackImage
        src={item.product_image}
        alt={item.product_name}
        className="order-product-image"
      />
      <div className="order-product-details">
        <h4>{item.product_name}</h4>
        <p>{item.variant_name}</p>
        <span className="order-product-quantity">
          Qty {item.quantity} Variant: {item.variant_name}
        </span>
      </div>
      <strong className="price order-product-price">
        {formatPrice(item.subtotal, item.currency_symbol)}
      </strong>
    </article>
  );
}

export default OrderProductCard;
