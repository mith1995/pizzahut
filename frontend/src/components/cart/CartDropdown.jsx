import CartItem from "./CartItem";
import CartHeader from "./CartHeader";
import CartTotal from "./CartTotal";
import CartAction from "./CartAction";
import { useCart } from "../../hooks/useCart";
import AnchorButton from "../common/AnchorButton";

const MAX_ITEMS_IN_PREVIEW = 3;

function CartDropdown({ isOpen, onToggle }) {
  const { data: cart, isLoading } = useCart();

  if (isLoading || !cart) return null;

  const items = cart.items ?? [];
  const visibleItems = items.slice(0, MAX_ITEMS_IN_PREVIEW);
  const totalItems = cart?.total_items || 0;

  return (
    <li className={`dropdown ${isOpen ? "open" : ""}`}>
      <AnchorButton
        type="button"
        className="m_tag"
        onMouseOver={onToggle}
        href="/cart"
      >
        <i className="fa fa-shopping-bag"></i>
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </AnchorButton>
      {isOpen && totalItems > 0 && (
        <ul className="dropdown-menu drop_1" role="menu">
          <li>
            <CartHeader totalItem={totalItems} />
            {visibleItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <CartTotal totalPrice={cart?.total_price} />
            <CartAction />
          </li>
        </ul>
      )}
    </li>
  );
}

export default CartDropdown;
