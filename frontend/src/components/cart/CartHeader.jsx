import { Link } from "react-router-dom";

function CartHeader({ totalItem }) {
  return (
    <div className="drop_1i clearfix">
      <div className="col-sm-6">
        <div className="drop_1il clearfix">
          <h5 className="mgt">{totalItem} ITEMS</h5>
        </div>
      </div>
      <div className="col-sm-6">
        <div className="drop_1il text-right clearfix">
          <h5 className="mgt">
            <Link to="/cart">VIEW CART</Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default CartHeader;
