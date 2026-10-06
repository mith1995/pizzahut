import { api } from "./api";

export const paymentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Razorpay order / payment session
    createPayment: build.mutation({
      query: (orderId) => ({
        url: "payments/create/",
        method: "POST",
        body: { order_id: orderId },
      }),
    }),

    verifyPayment: build.mutation({
      query: (payload) => ({
        url: "payments/verify/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart", "Order"],
    }),

    paymentFailed: build.mutation({
      query: (payload) => ({
        url: "payments/failed/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
  usePaymentFailedMutation,
} = paymentsApi;
