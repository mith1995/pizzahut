import { api } from "./api";

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => "home/",
    }),
  }),
});

export const { useGetHomeQuery } = homeApi;
