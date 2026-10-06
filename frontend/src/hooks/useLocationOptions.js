import { useEffect, useState } from "react";
import {
  useLazyGetCitiesQuery,
  useLazyGetCountriesQuery,
  useLazyGetStatesQuery,
} from "../services/locationsApi";

export const useLocationOptions = ({ selectedCountry, selectedState }) => {
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [getCountries] = useLazyGetCountriesQuery();
  const [getStates] = useLazyGetStatesQuery();
  const [getCities] = useLazyGetCitiesQuery();

  // Load Countries:
  const loadCountries = async (inputValue) => {
    try {
      const response = await getCountries(inputValue ?? "", true).unwrap();
      return response.map((country) => ({
        value: country.id,
        label: country.name,
      }));
    } catch (error) {
      console.error("Country API error:", error);
      return [];
    }
  };

  // Load States:
  const fetchStates = async (search = "") => {
    if (!selectedCountry?.value) {
      return [];
    }

    try {
      const response = await getStates(
        {
          countryId: selectedCountry.value,
          search,
        },
        true,
      ).unwrap();

      return response.map((state) => ({
        value: state.id,
        label: state.name,
      }));
    } catch (error) {
      console.error("States API error:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialStates = async () => {
      const options = await fetchStates();
      setStateOptions(options);
    };
    loadInitialStates();
  }, [selectedCountry]);

  const loadStates = (inputValue) => {
    return fetchStates(inputValue);
  };

  // Load Cities:
  const fetchCities = async (search = "") => {
    if (!selectedState?.value) {
      return [];
    }

    try {
      const response = await getCities(
        {
          stateId: selectedState.value,
          search,
        },
        true,
      ).unwrap();

      return response.map((city) => ({
        value: city.id,
        label: city.name,
      }));
    } catch (error) {
      console.error("Cities API error:", error);
      return [];
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialCities = async () => {
      setCityOptions([]);
      if (!selectedState?.value) return;

      setCitiesLoading(true);
      const options = await fetchCities();
      if (!cancelled) {
        setCityOptions(options);
        setCitiesLoading(false);
      }
    };
    loadInitialCities();
    return () => {
      cancelled = true;
    };
  }, [selectedState?.value]);

  const loadCities = (inputValue) => {
    return fetchCities(inputValue);
  };

  return {
    loadCountries,
    loadStates,
    loadCities,
    stateOptions,
    cityOptions,
    citiesLoading,
  };
};
