import { api } from "./api";

export const wishlistProductApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query({
      query: () => ({
        url: "wishlist/",
      }),
      providesTags: [{ type: "Wishlist", id: "Product" }],
    }),

    addToWishlist: build.mutation({
      query: (data) => ({
        url: "wishlist/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Wishlist", id: "Product" }],
    }),

    removeFromWishlist: build.mutation({
      query: ({ product_id }) => ({
        url: `wishlist/${product_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Wishlist", id: "Product" }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistProductApi;
