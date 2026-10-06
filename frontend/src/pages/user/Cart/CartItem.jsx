import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import AnchorButton from "../../../components/common/AnchorButton";
import { formatListWithAnd, formatPrice } from "../../../utils/helper";
import { useUpdateCartItem } from "../../../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../../../hooks/useRemoveCartItem";

function CartItem({ cart }) {
  const [quantity, setQuantity] = useState(cart.quantity);
  const { updateCartItem } = useUpdateCartItem();
  const { removeCartItem } = useRemoveCartItem();

  const category = cart.variant.category;
  const ingredients = cart.variant.ingredients;
  const total_price = cart.total_price;
  const product_name = cart.variant.product_name;
  const product_slug = cart.variant.product_slug;
  const product_image = cart.variant.product_image;
  const currency_symbol = cart.currency_symbol;
  const max_quantity = cart.max_quantity;

  const increaseQty = () => {
    if (max_quantity - 1 < quantity) return;

    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleUpdateCartItem(newQuantity);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;

    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    handleUpdateCartItem(newQuantity);
  };

  const handleUpdateCartItem = async (newQuantity) => {
    try {
      await updateCartItem(cart.variant.id, newQuantity);
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  const handleRemoveCartItem = async () => {
    try {
      await removeCartItem(cart.variant.id, quantity);
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  return (
    <article className="pizza-cart-item" data-price={total_price}>
      <img src={product_image} alt={product_name} />
      <div className="pizza-item-details">
        <p className="item-category">{category}</p>
        <AnchorButton href={`/pizzas/${product_slug}`}>
          <h4>{product_name}</h4>
        </AnchorButton>
        <p>{formatListWithAnd(ingredients)}</p>
        <div className="item-controls">
          <div className="quantity-control" aria-label="Margherita quantity">
            <Button onClick={decreaseQty}>-</Button>
            <input
              className="item-quantity"
              type="number"
              min="1"
              value={quantity}
              aria-label={product_name}
            />
            <Button onClick={increaseQty}>+</Button>
          </div>
          <Button className="remove-item" onClick={handleRemoveCartItem}>
            Remove
          </Button>
        </div>
      </div>
      <strong className="item-price">
        {formatPrice(total_price, currency_symbol)}
      </strong>
    </article>
  );
}

export default CartItem;
