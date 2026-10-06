import AnchorButton from "../../../components/common/AnchorButton";

function EmptyOrder() {
  return (
    <div id="order-empty-state" className="order-empty-state">
      <span>
        <i className="fa fa-cube"></i>
      </span>
      <h3>No tracked orders yet</h3>
      <p>
        Once you place an order, its live status and details will appear here.
      </p>
      <AnchorButton className="button" href="/pizzas">
        Explore the menu <i className="fa fa-arrow-right"></i>
      </AnchorButton>
    </div>
  );
}

export default EmptyOrder;
