import AnchorButton from "../../../components/common/AnchorButton";
import ProductState from "../../../components/common/ProductState";
import { useCart } from "../../../hooks/useCart";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";

function CartSection() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState type="loading" />
        </div>
      </section>
    );
  }
  return (
    <section id="cart_page" className="clearfix cart">
      <div className="container">
        <div className="cart-heading">
          <div>
            <p className="cart-eyebrow">YOUR ORDER</p>
            <h2 className="mgt">Shopping cart</h2>
            <p className="cart-subtitle">
              Freshly made, just the way you like it.
            </p>
          </div>
          <AnchorButton className="cart-continue" href="/pizzas">
            <i className="fa fa-arrow-left"></i> Continue shopping
          </AnchorButton>
        </div>
        {!cart?.total_items ? (
          <EmptyCart />
        ) : (
          <div className="cart-layout">
            <div className="cart-items-panel">
              <div className="cart-panel-heading">
                <h4>
                  Your items{" "}
                  <span id="item-count">{cart.total_items} items</span>
                </h4>
                <span>Price</span>
              </div>
              {cart.items.map((item) => (
                <CartItem key={item.id} cart={item} />
              ))}
            </div>
            <OrderSummary cart={cart} />{" "}
          </div>
        )}
      </div>
    </section>
  );
}

export default CartSection;
