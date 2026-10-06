import AnchorButton from "../../../components/common/AnchorButton";

function EmptyCart() {
  return (
    <div class="empty-cart">
      <i class="fa fa-shopping-bag"></i>
      <h4>Your cart is empty</h4>
      <AnchorButton href="/pizzas">Explore the menu</AnchorButton>
    </div>
  );
}

export default EmptyCart;
