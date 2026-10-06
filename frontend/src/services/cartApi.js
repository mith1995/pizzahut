import { api } from "./api";

export const cartApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query({
      query: () => "/cart/",
      providesTags: ["Cart"],
      keepUnusedDataFor: 300,
    }),

    getGuestCart: build.query({
      query: () => "/cart/guest/",
      providesTags: ["Cart"],
      keepUnusedDataFor: 300,
    }),

    addCartItem: build.mutation({
      query: ({ variant_id, quantity }) => ({
        url: "/cart/add_item/",
        method: "POST",
        body: {
          variant_id,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    addGuestCartItem: build.mutation({
      query: ({ variant_id, quantity }) => ({
        url: "/cart/guest/add_item/",
        method: "POST",
        body: {
          variant_id,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: build.mutation({
      query: ({ variant_id, quantity }) => ({
        url: "/cart/update_item/",
        method: "PATCH",
        body: {
          variant_id,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateGuestCartItem: build.mutation({
      query: ({ variant_id, quantity }) => ({
        url: "/cart/guest/update_item/",
        method: "PATCH",
        body: {
          variant_id,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: build.mutation({
      query: ({ variant_id }) => ({
        url: "/cart/remove_item/",
        method: "POST",
        body: {
          variant_id,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeGuestCartItem: build.mutation({
      query: ({ variant_id }) => ({
        url: "/cart/guest/remove_item/",
        method: "POST",
        body: {
          variant_id,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: build.mutation({
      query: () => ({
        url: "/cart/clear/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearGuestCart: build.mutation({
      query: () => ({
        url: "/cart/guest/clear/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    validateCart: build.query({
      query: () => "/cart/validate/",
      providesTags: ["Cart"],
    }),

    validateGuestCart: build.query({
      query: () => "/cart/guest/validate/",
      providesTags: ["Cart"],
    }),

    mergeGuestCart: build.mutation({
      query: () => ({
        url: "/cart/guest/merge_to_user/",
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetGuestCartQuery,
  useAddCartItemMutation,
  useAddGuestCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateGuestCartItemMutation,
  useRemoveCartItemMutation,
  useRemoveGuestCartItemMutation,
  useClearCartMutation,
  useClearGuestCartMutation,
  useValidateCartQuery,
  useValidateGuestCartQuery,
  useMergeGuestCartMutation,
} = cartApi;
