import {
  useRemoveCartItemMutation,
  useRemoveGuestCartItemMutation,
} from "../services/cartApi";
import { isGuest } from "../utils/auth";

export function useRemoveCartItem() {
  const guestMode = isGuest();

  const [removeUserItem] = useRemoveCartItemMutation();
  const [removeGuestUserItem] = useRemoveGuestCartItemMutation();

  const removeCartItem = async (variantId, quantity) => {
    const payload = { variant_id: variantId, quantity };

    if (guestMode) {
      return removeGuestUserItem(payload).unwrap();
    } else {
      return removeUserItem(payload).unwrap();
    }
  };

  return {
    removeCartItem,
    isGuest: guestMode,
  };
}
