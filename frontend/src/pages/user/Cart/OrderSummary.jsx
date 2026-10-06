import AnchorButton from "../../../components/common/AnchorButton";
import { isGuest } from "../../../utils/auth";
import { formatPrice } from "../../../utils/helper";

function OrderSummary({ cart }) {
  const total_price = cart.total_price;
  const delivery_fee = cart.delivery_fee;
  const tax = cart.tax_amount;
  const final_amount = cart.final_amount;
  const currency_symbol = cart.currency_symbol;

  return (
    <aside className="order-summary">
      <div className="summary-title">
        <h4>Order summary</h4>
        <span className="secure-note">
          <i className="fa fa-lock"></i> Secure checkout
        </span>
      </div>
      <div className="delivery-details">
        <div className="delivery-service">
          <i className="fa fa-motorcycle"></i>
          <span>
            <strong>Home delivery</strong>
            <small>Address details at checkout</small>
          </span>
        </div>
        <p className="delivery-estimate">
          <i className="fa fa-clock-o"></i> Estimated delivery
          <strong>30–40 min</strong>
        </p>
      </div>
      <div className="payment-section">
        <p className="summary-label">PAYMENT METHOD</p>
        <label className="payment-option">
          <input type="radio" name="payment-method" value="upi" />
          <span className="payment-icon">
            <i className="fa fa-mobile"></i>
          </span>
          <span>
            <strong>UPI</strong>
            <small>Pay with any UPI app</small>
          </span>
          <i className="fa fa-check-circle payment-check"></i>
        </label>
        <label className="payment-option">
          <input type="radio" name="payment-method" value="card" />
          <span className="payment-icon">
            <i className="fa fa-credit-card"></i>
          </span>
          <span>
            <strong>Credit / Debit card</strong>
            <small>Visa, Mastercard &amp; RuPay</small>
          </span>
          <i className="fa fa-check-circle payment-check"></i>
        </label>
        <label className="payment-option">
          <input type="radio" name="payment-method" value="cod" />
          <span className="payment-icon">
            <i className="fa fa-money"></i>
          </span>
          <span>
            <strong>Cash on delivery</strong>
            <small>Pay when your order arrives</small>
          </span>
          <i className="fa fa-check-circle payment-check"></i>
        </label>
      </div>
      <div className="price-breakdown">
        <div>
          <span>Subtotal</span>
          <strong id="subtotal-value">
            {formatPrice(total_price, currency_symbol)}
          </strong>
        </div>
        <div>
          <span>Delivery fee</span>
          <strong id="delivery-value">
            {formatPrice(delivery_fee, currency_symbol)}
          </strong>
        </div>
        <div>
          <span>Taxes (5%)</span>
          <strong id="tax-value">{formatPrice(tax, currency_symbol)}</strong>
        </div>
        <div className="total-row">
          <span>Total</span>
          <strong id="total-value">
            {formatPrice(final_amount, currency_symbol)}
          </strong>
        </div>
      </div>
      <AnchorButton
        className="checkout-button"
        aria-disabled={total_price === 0}
        href={`${isGuest() ? "/login" : "/checkout"}`}
      >
        Continue to checkout <i className="fa fa-arrow-right"></i>
      </AnchorButton>
      <p className="payment-assurance">
        <i className="fa fa-shield"></i> Your payment details are protected
      </p>
      <div className="accepted-payments">
        <span>WE ACCEPT</span>
        <strong>UPI</strong>
        <strong>VISA</strong>
        <strong>RuPay</strong>
        <strong>COD</strong>
      </div>
    </aside>
  );
}

export default OrderSummary;
