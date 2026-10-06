import {
  useAddCartItemMutation,
  useAddGuestCartItemMutation,
} from "../services/cartApi";
import { isGuest } from "../utils/auth";

export function useAddToCart() {
  const guestMode = isGuest();

  const [addUserItem] = useAddCartItemMutation();
  const [addGuestUserItem] = useAddGuestCartItemMutation();

  const addToCart = async (variantId, quantity) => {
    const payload = { variant_id: variantId, quantity };

    if (guestMode) {
      return addGuestUserItem(payload).unwrap();
    } else {
      return addUserItem(payload).unwrap();
    }
  };

  return {
    addToCart,
    isGuest: guestMode,
  };
}
