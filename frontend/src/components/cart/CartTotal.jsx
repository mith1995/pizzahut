function CartTotal({ totalPrice }) {
  return (
    <div className="drop_1i2 clearfix">
      <div className="col-sm-6">
        <div className="drop_1il clearfix">
          <h5 className="mgt">TOTAL</h5>
        </div>
      </div>
      <div className="col-sm-6">
        <div className="drop_1il text-right clearfix">
          <h5 className="mgt col_1">${totalPrice.toFixed(2)}</h5>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
