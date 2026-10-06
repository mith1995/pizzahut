import {
  useUpdateCartItemMutation,
  useUpdateGuestCartItemMutation,
} from "../services/cartApi";
import { isGuest } from "../utils/auth";

export function useUpdateCartItem() {
  const guestMode = isGuest();

  const [updateUserCartItem, userState] = useUpdateCartItemMutation();
  const [updateGuestCartItem, guestState] = useUpdateGuestCartItemMutation();

  const activeState = guestMode ? guestState : userState;

  const updateCartItem = async (variantId, quantity) => {
    const payload = { variant_id: variantId, quantity };

    if (guestMode) {
      return updateGuestCartItem(payload).unwrap();
    } else {
      return updateUserCartItem(payload).unwrap();
    }
  };

  return {
    updateCartItem,
    isGuest: guestMode,
    ...activeState,
  };
}
