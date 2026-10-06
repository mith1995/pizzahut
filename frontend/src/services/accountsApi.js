import { api } from "./api";

export const accountsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAddresses: build.query({
      query: () => "/accounts/addresses/",
      providesTags: ["Address"],
    }),

    creatAddress: build.mutation({
      query: (data) => ({
        url: "/accounts/addresses/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    editAddress: build.query({
      query: ({ address_id }) => ({
        url: `/accounts/addresses/${address_id}`,
      }),
      providesTags: ["Address"],
    }),

    updateAddress: build.mutation({
      query: ({ address_id, data }) => {
        // console.log("update args:", { address_id, data });
        const config = {
          url: `/accounts/addresses/${address_id}/`,
          method: "PATCH",
          body: data,
        };
        // console.log("request config:", config);
        return config;
      },
      invalidatesTags: ["Address"],
    }),

    deleteAddress: build.mutation({
      query: ({ address_id }) => ({
        url: `/accounts/addresses/${address_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),

    selectAddress: build.mutation({
      query: ({ address_id }) => {
        const config = {
          url: `/accounts/addresses/${address_id}/set-default/`,
          method: "POST",
        };
        return config;
      },
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreatAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useLazyEditAddressQuery,
  useSelectAddressMutation,
} = accountsApi;
