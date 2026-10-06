import { formatPrice } from "../../../utils/helper";

function OrderPaymentSummary({ order }) {
  return (
    <section className="customer-panel">
      <span className="section-eyebrow">PAYMENT BREAKDOWN</span>
      <h3>Order summary</h3>
      <div className="price-breakdown">
        <div>
          <span>Items subtotal</span>
          <strong id="tracked-subtotal">
            {formatPrice(order.total_amount, order.currency_symbol)}
          </strong>
        </div>
        <div>
          <span>Shipping fee</span>
          <strong id="tracked-shipping" className="free-shipping">
            {!order.delivery_fee
              ? "Free"
              : formatPrice(order.delivery_fee, order.currency_symbol)}
          </strong>
        </div>
        <div>
          <span id="tracked-tax-label">Tax / GST (18%)</span>
          <strong id="tracked-tax">
            {!order.tax_amount
              ? "0.00"
              : formatPrice(order.tax_amount, order.currency_symbol)}
          </strong>
        </div>
        <div>
          <span>Discount coupon</span>
          <strong id="tracked-discount" className="discount-value">
            {!order.discount_amount
              ? "0.00"
              : `-${formatPrice(order.discount_amount, order.currency_symbol)}`}
          </strong>
        </div>
        <div className="summary-total clearfix">
          <span>Grand total</span>
          <strong id="tracked-total" className="pull-right price">
            {formatPrice(order.final_amount, order.currency_symbol)}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default OrderPaymentSummary;
