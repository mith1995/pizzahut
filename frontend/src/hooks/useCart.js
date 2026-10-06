import { useGetCartQuery, useGetGuestCartQuery } from "../services/cartApi";
import { isGuest } from "../utils/auth";

export function useCart() {
  const guestMode = isGuest();
  const userQuery = useGetCartQuery(undefined, {
    skip: guestMode,
    refetchOnMountOrArgChange: true, // page khulte hi fresh data
    refetchOnFocus: true, // tab par wapas aate hi fresh data
    refetchOnReconnect: true,
  });

  const guestQuery = useGetGuestCartQuery(undefined, {
    skip: !guestMode,
    refetchOnMountOrArgChange: true, // page khulte hi fresh data
    refetchOnFocus: true, // tab par wapas aate hi fresh data
    refetchOnReconnect: true,
  });

  const query = guestMode ? guestQuery : userQuery;

  return {
    ...query,
    isGuest: guestMode,
  };
}
