import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import Modal from "../../../components/common/Modal";
import FormInput from "../../../components/common/FormInput";
import FormLocationAsyncSelect from "../../../components/common/FormLocationAsyncSelect";
import { useLocationOptions } from "../../../hooks/useLocationOptions";
import { addressSchema } from "../../../validations/address_schema";
import {
  ADDRESS_TYPES,
  addressToFormValues,
  EMPTY_ADDRESS_FORM,
  formToAddressPayload,
} from "../../../utils/address";

function AddressFormModal({ address, isSaving, onSave, onClose }) {
  const hasCitiesCtx = useRef({ hasCities: false, hasStates: false }).current;

  // React Hook Form for the Address
  const {
    control,
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    context: hasCitiesCtx,
    defaultValues: address ? addressToFormValues(address) : EMPTY_ADDRESS_FORM,
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const {
    loadCountries,
    loadStates,
    loadCities,
    cityOptions,
    stateOptions,
    citiesLoading,
  } = useLocationOptions({
    selectedCountry,
    selectedState,
  });

  // har render pe latest value, validation ke time yahi padhi jati hai
  hasCitiesCtx.hasCities = cityOptions.length > 0;
  hasCitiesCtx.hasStates = stateOptions.length > 0;
  return (
    <Modal
      show
      onClose={onClose}
      title={address ? "EDIT ADDRESS" : "DELIVERY ADDRESS"}
      subTitle={address ? "Update your address" : "Add a new address"}
      submitBtn={address ? "Update Address" : "Save Address"}
      formId="address-form"
      isDisabled={citiesLoading || isSaving}
    >
      <form
        id="address-form"
        onSubmit={handleSubmit((d) => onSave(formToAddressPayload(d)))}
      >
        <div className="checkout-fields">
          <div className="checkout-field">
            <label htmlFor="address-name">Address name</label>
            <Controller
              name="address_type"
              control={control}
              inputId="address-name"
              render={({ field }) => (
                <Select
                  {...field}
                  options={ADDRESS_TYPES}
                  placeholder="Select Address Type"
                  classNamePrefix="pizza-select"
                />
              )}
            />

            {errors.address_type && (
              <p className="error" role="alert">
                {errors.address_type.message}
              </p>
            )}
          </div>
          <div className="checkout-field">
            <FormLocationAsyncSelect
              label="Country"
              name="country"
              control={control}
              loadOptions={loadCountries}
              placeholder="Select Country"
              error={errors.country}
              onChange={() => {
                setValue("state", null);
                setValue("city", null);
              }}
            />
          </div>
          <div className="checkout-field checkout-field-wide">
            <FormInput
              label="Street address"
              id="address-line-1"
              placeholder="House number and street name"
              {...register("address_line1")}
              error={errors.address_line1}
            />
          </div>
          <div className="checkout-field checkout-field-wide">
            <FormInput
              label="Apartment, suite, etc."
              id="address-line-2"
              placeholder="Apartment, floor, or landmark"
              {...register("address_line2")}
            />
          </div>
          <div className="checkout-field">
            <FormLocationAsyncSelect
              label="State / region"
              name="state"
              control={control}
              options={stateOptions}
              loadOptions={loadStates}
              placeholder="Select state"
              isDisabled={!selectedCountry}
              error={errors.state}
              onChange={() => {
                setValue("city", null);
              }}
            />
          </div>
          <div className="checkout-field">
            <FormLocationAsyncSelect
              label="City"
              name="city"
              control={control}
              options={cityOptions}
              loadOptions={loadCities}
              placeholder="Select city"
              isDisabled={!selectedState}
              error={errors.city}
            />
          </div>
          <div className="checkout-field">
            <FormInput
              label="Postal code"
              id="postal-code"
              placeholder="Postal code"
              {...register("pincode")}
              error={errors.pincode}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default AddressFormModal;
