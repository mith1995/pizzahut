import { Link } from "react-router-dom";

function CartAction() {
  return (
    <div className="drop_1i3 text-center clearfix">
      <div className="col-sm-12">
        <h5>
          <Link className="button_1 block" to="/checkout">
            CHECKOUT
          </Link>
        </h5>
        <h5>
          <Link className="button block" to="/cart">
            VIEW CART
          </Link>
        </h5>
      </div>
    </div>
  );
}

export default CartAction;
