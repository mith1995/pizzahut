import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenRefreshed, logout } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    // headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Step 1: envelope unwrap + error normalize
const baseQueryWithEnvelope = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const body = result.error.data;
    return {
      error: {
        status: result.error.status,
        message: body?.message || "Something went wrong",
        errors: body?.errors ?? null,
      },
    };
  }

  if (result.data?.success === true) {
    return {
      data: result.data.data,
      meta: { ...result.meta, message: result.data.message },
    };
  }

  return result; // 204 jaise empty response
};

// Step 2: reauth, unwrap ke upar
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQueryWithEnvelope(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const isAuthCall =
    url?.startsWith("auth/login") || url?.startsWith("auth/register");

  if (result?.error?.status === 401 && !isAuthCall) {
    const refreshToken = api.getState().auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQueryWithEnvelope(
      {
        url: "token/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data?.access) {
      api.dispatch(
        tokenRefreshed({
          access: refreshResult.data.access,
          refresh: refreshResult.data.refresh ?? refreshToken,
        }),
      );
      result = await baseQueryWithEnvelope(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Cart",
    "Product",
    "User",
    "Order",
    "Addresses",
    "Country",
    "State",
    "City",
  ],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (page = 1) => ({
        url: "products/",
        params: {
          page,
        },
      }),
      providesTags: ["Product"],
    }),

    getProduct: builder.query({
      query: (slug) => ({
        url: `products/${slug}`,
      }),
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),

    // Registration
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "auth/register/",
        method: "POST",
        body: userData,
      }),
    }),

    // Login
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email Verification
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `auth/verify-email/?token=${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `auth/forgot-password/`,
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `auth/reset-password/`,
        method: "POST",
        body: data,
      }),
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "auth/change-password/",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    // Edit Profile
    editProfile: builder.query({
      query: () => ({
        url: "auth/profile/",
      }),
    }),

    // getProduct: builder.query({
    //   query: (slug) => ({
    //     url: `products/${slug}`,
    //   }),
    //   providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    // }),

    // Update Profile
    updateProfile: builder.mutation({
      query: (updatedData) => ({
        url: "auth/update-profile/",
        method: "PATCH",
        body: updatedData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useEditProfileQuery,
  useUpdateProfileMutation,
} = api;
