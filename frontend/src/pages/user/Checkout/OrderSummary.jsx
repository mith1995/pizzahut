import Button from "../../../components/common/Button";
import { useCart } from "../../../hooks/useCart";
import { formatPrice } from "../../../utils/helper";

function OrderSummary({ onPlaceOrder, isPlacing, hasAddress, hasOrder }) {
  const { data } = useCart();
  const totalPrice = data?.total_price;
  const deliveryFee = data?.delivery_fee;
  const taxAmount = data?.tax_amount;
  const finalAmount = data?.final_amount;
  const currencySymbol = data?.currency_symbol;
  return (
    <aside className="checkout-summary" aria-labelledby="summary-title">
      <div className="checkout-summary-heading">
        <h3 id="summary-title">Order summary</h3>
        <span>
          <i className="fa fa-lock" aria-hidden="true"></i> Secure
        </span>
      </div>
      <div className="checkout-price-list">
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(totalPrice, currencySymbol)}</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>
            {deliveryFee > 0
              ? formatPrice(deliveryFee, currencySymbol)
              : "Free"}
          </strong>
        </div>
        {taxAmount > 0 && (
          <div>
            <span>Taxes (5%)</span>
            <strong>{formatPrice(taxAmount, currencySymbol)}</strong>
          </div>
        )}

        <div className="checkout-total">
          <span>Total</span>
          <strong>{formatPrice(finalAmount, currencySymbol)}</strong>
        </div>
      </div>

      <div className="checkout-payment">
        <h4>Payment method</h4>
        <label className="checkout-payment-option">
          <input type="radio" name="payment" value="online" checked readOnly />
          <span className="payment-icon">
            <i className="fa fa-credit-card" aria-hidden="true"></i>
          </span>
          <span className="payment-copy">
            <strong>Pay online</strong>
            <small>UPI or Card, secured by Razorpay</small>
          </span>
          <i className="fa fa-check payment-selected" aria-hidden="true"></i>
        </label>
      </div>

      <Button
        className="checkout-submit"
        disabled={(!finalAmount && !hasOrder) || !hasAddress || isPlacing}
        onClick={onPlaceOrder}
      >
        {hasOrder ? "Retry payment" : "Place order"}{" "}
        <i className="fa fa-arrow-right" aria-hidden="true"></i>
      </Button>
      <p className="checkout-assurance">
        <i className="fa fa-shield" aria-hidden="true"></i> Your information is
        protected
      </p>
    </aside>
  );
}

export default OrderSummary;
