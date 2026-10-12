import { api } from "./api";

export const reviewsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReviews: build.query({
      query: (slug) => ({ url: `products/${slug}/reviews/` }),
      providesTags: (result, error, slug) => [{ type: "Review", id: slug }],
    }),

    addReview: build.mutation({
      query: ({ slug, rating, comment }) => ({
        url: `products/${slug}/reviews/`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Review", id: slug },
      ],
    }),

    updateReview: build.mutation({
      query: ({ slug, id, rating, comment }) => ({
        url: `products/${slug}/reviews/${id}/`,
        method: "PATCH",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Review", id: slug },
      ],
    }),

    deleteReview: build.mutation({
      query: ({ slug, id }) => ({
        url: `products/${slug}/reviews/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Review", id: slug },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
