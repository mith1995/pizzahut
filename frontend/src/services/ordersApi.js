import { api } from "./api";

export const ordersApi = api.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation({
      query: (data) => ({
        url: `/orders/checkout/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    getOrders: build.query({
      query: ({ page = 1, pageSize = 5, status } = {}) => ({
        url: `/orders/`,
        params: {
          page,
          page_size: pageSize,
          ...(status ? { status } : {}),
        },
      }),
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderById: build.query({
      query: (id) => `/orders/${id}/`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    cancelOrder: build.mutation({
      query: ({ id, reason = "" }) => ({
        url: `/orders/${id}/cancel/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    requestReturn: build.mutation({
      query: ({ id, reason, comment = "" }) => ({
        url: `/orders/${id}/return/`,
        method: "POST",
        body: { reason, comment },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    getInvoicePdf: build.query({
      query: (id) => ({
        url: `/orders/${id}/invoice/`,
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    cancelReturn: build.mutation({
      query: ({ id }) => ({
        url: `/orders/${id}/return/cancel/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useRequestReturnMutation,
  useLazyGetInvoicePdfQuery,
  useCancelReturnMutation,
} = ordersApi;
