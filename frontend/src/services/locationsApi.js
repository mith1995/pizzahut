import { api } from "./api";

export const locationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query({
      query: (search = "") => ({
        url: "/locations/countries/",
        params: {
          search,
        },
      }),
      providesTags: ["Country"],
      keepUnusedDataFor: 3600, // Store cache in 1 hour till
    }),

    getStates: build.query({
      query: ({ countryId, search = "" }) => ({
        url: "/locations/states/",
        params: {
          country: countryId,
          search,
        },
      }),
      providesTags: ["State"],
      keepUnusedDataFor: 3600, // Store cache in 1 hour till
    }),

    getCities: build.query({
      query: ({ stateId, search = "" }) => ({
        url: "/locations/cities/",
        params: {
          state: stateId,
          search,
        },
      }),
      providesTags: ["City"],
      keepUnusedDataFor: 3600, // Store cache in 1 hour till
    }),
  }),
});

export const {
  useLazyGetCountriesQuery,
  useLazyGetStatesQuery,
  useLazyGetCitiesQuery,
} = locationsApi;
