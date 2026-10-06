import { useEffect, useRef, useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import AddressCard from "./AddressCard";
import Modal from "../../../components/common/Modal";
import Select from "react-select";
import {
  useCreatAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSelectAddressMutation,
  useUpdateAddressMutation,
} from "../../../services/accountsApi";
import ApiStateHandler from "../../../components/common/ApiStateHandler";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { useLocationOptions } from "../../../hooks/useLocationOptions";
import FormLocationAsyncSelect from "../../../components/common/FormLocationAsyncSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema } from "../../../validations/address_schema";

const ADDRESS_TYPES = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

function AddressForm() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const hasCitiesCtx = useRef({ hasCities: false, hasStates: false }).current;

  // React Hook Form for the Address
  const {
    control,
    watch,
    setValue,
    register: addressRegister,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    context: hasCitiesCtx,
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

  const { data: shippingAddresses, isLoading: isAddressesLoading } =
    useGetAddressesQuery();

  const [addAddress, { isLoading: isAddingAddress }] =
    useCreatAddressMutation();

  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();

  const [deleteAddress, { isLoading: isDeletingAddress }] =
    useDeleteAddressMutation();

  const [selectAddress] = useSelectAddressMutation();
  // Open a new Address Form
  const handleAddAddress = () => {
    setEditingAddress(null);

    resetAddressForm({
      address_type: null,
      country: null,
      state: null,
      city: null,
      address_line1: "",
      address_line2: "",
      pincode: "",
    });

    setShowModal(true);
  };

  // Edit Address Form
  useEffect(() => {
    if (!editingAddress) return;

    resetAddressForm({
      address_type: {
        value: editingAddress.address_type,
        label: editingAddress.address_type,
      },

      country: {
        value: editingAddress.country.id,
        label: editingAddress.country.name,
      },

      state: {
        value: editingAddress.state.id,
        label: editingAddress.state.name,
      },

      city: {
        value: editingAddress.city.id,
        label: editingAddress.city.name,
      },

      address_line1: editingAddress.address_line1,
      address_line2: editingAddress.address_line2,
      pincode: editingAddress.pincode,
    });
  }, [editingAddress, resetAddressForm]);

  // Create and update Address
  const onAddressSubmit = async (data) => {
    try {
      const payload = {
        address_type: data.address_type.value,
        country_id: data.country.value,
        state_id: data.state.value,
        city_id: data.city.value,
        pincode: data.pincode,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || "",
      };

      if (editingAddress) {
        await updateAddress({
          address_id: editingAddress.id,
          data: payload,
        }).unwrap();
        toast.success("Address updated successfully", {
          duration: 3000,
        });
      } else {
        await addAddress({ ...payload, is_default: true }).unwrap();
        toast.success("Address created successfully", {
          duration: 3000,
        });
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  //  Close Form Modal
  const handleCloseModal = () => {
    resetAddressForm();
    setShowModal(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowModal(true);
  };
  const handleDeleteAddress = (address) => {
    setDeletingAddress(address);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeletingAddress(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;

    try {
      await deleteAddress({
        address_id: deletingAddress.id,
      }).unwrap();

      toast.success("Address deleted successfully", {
        duration: 3000,
      });

      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error?.data?.error || "Unable to delete address");
    }
  };

  const handleSelectAddress = async (address) => {
    try {
      await selectAddress({ address_id: address.id }).unwrap();
      toast.success("Default address updated successfully", {
        duration: 3000,
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  // All Variables
  const addresses = shippingAddresses?.addresses || [];
  const maxAllowed = shippingAddresses?.max_allowed;
  const createdCount = shippingAddresses?.created;
  const canAddMore = shippingAddresses?.can_add_more;

  const isLoading =
    isAddressesLoading ||
    isAddingAddress ||
    isUpdatingAddress ||
    isDeletingAddress;
  if (isLoading) {
    return <ApiStateHandler isLoading={isLoading} loadingTitle="Loading..." />;
  }

  return (
    <>
      <section className="checkout-form-panel" aria-labelledby="delivery-title">
        <div className="checkout-panel-heading">
          <span className="checkout-step">01</span>
          <div>
            <h3 id="delivery-title">Contact details</h3>
            <p>How can we reach you about this order?</p>
          </div>
        </div>

        <form className="delivery-form">
          <div className="checkout-fields">
            <div className="checkout-field">
              <FormInput
                label="First name"
                id="first-name"
                autocomplete="given-name"
                placeholder="e.g. Ayesha"
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Last name"
                id="last-name"
                autocomplete="family-name"
                placeholder="e.g. Khan"
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Email address"
                id="email"
                autocomplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Phone number"
                id="phone"
                autocomplete="tel"
                placeholder="Your contact number"
              />
            </div>
          </div>
        </form>

        <div className="saved-addresses" aria-labelledby="saved-address-title">
          <div className="saved-address-heading">
            <div>
              <div className="checkout-panel-heading saved-address-title-row">
                <span className="checkout-step">02</span>
                <div>
                  <h3 id="saved-address-title">Delivery address</h3>
                  <p>Choose an address for this order</p>
                </div>
              </div>
            </div>
            <span className="address-count">
              {createdCount} of {maxAllowed} saved
            </span>
          </div>

          <div className="saved-address-grid">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                data={address}
                onEdit={() => handleEditAddress(address)}
                onDelete={() => handleDeleteAddress(address)}
                onChangeDefault={() => handleSelectAddress(address)}
              />
            ))}
          </div>
          {canAddMore && (
            <Button
              className="add-address-trigger"
              onClick={() => handleAddAddress()}
            >
              <i className="fa fa-plus" aria-hidden="true"></i> Add a new
              address
            </Button>
          )}
        </div>
      </section>
      {showModal && (
        <>
          <Modal
            show={showModal}
            onClose={handleCloseModal}
            title={editingAddress ? "EDIT ADDRESS" : "DELIVERY ADDRESS"}
            subTitle={
              editingAddress ? "Update your address" : "Add a new address"
            }
            submitBtn={editingAddress ? "Update Address" : "Save Address"}
            formId="address-form"
            isDisabled={citiesLoading}
          >
            <form
              id="address-form"
              onSubmit={handleAddressSubmit(onAddressSubmit)}
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

                  {addressErrors.address_type && (
                    <p className="error" role="alert">
                      {addressErrors.address_type.message}
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
                    error={addressErrors.country}
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
                    autocomplete="address-line1"
                    placeholder="House number and street name"
                    {...addressRegister("address_line1")}
                    error={addressErrors.address_line1}
                  />
                </div>
                <div className="checkout-field checkout-field-wide">
                  <FormInput
                    label="Apartment, suite, etc."
                    id="address-line-2"
                    autocomplete="address-line2"
                    placeholder="Apartment, floor, or landmark"
                    {...addressRegister("address_line2")}
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
                    error={addressErrors.state}
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
                    error={addressErrors.city}
                  />
                </div>
                <div className="checkout-field">
                  <FormInput
                    label="Postal code"
                    id="postal-code"
                    autocomplete="postal-code"
                    placeholder="Postal code"
                    {...addressRegister("pincode")}
                    error={addressErrors.pincode}
                  />
                </div>
              </div>
            </form>
          </Modal>
        </>
      )}

      {showDeleteModal && (
        <Modal
          show={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="DELETE ADDRESS"
          subTitle="Are you sure you want to delete this address?"
          submitBtn={isDeletingAddress ? "Deleting..." : "Delete"}
          formId="delete-address-form"
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this address?</p>

            {deletingAddress && (
              <div className="delete-address-preview">
                <strong>{deletingAddress.address_type}</strong>

                <p>
                  {deletingAddress.address_line1}
                  {deletingAddress.address_line2 && (
                    <>
                      <br />
                      {deletingAddress.address_line2}
                    </>
                  )}
                  <br />
                  {deletingAddress.city.name}, {deletingAddress.state.name}{" "}
                  {deletingAddress.pincode}
                </p>
              </div>
            )}

            <form
              id="delete-address-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default AddressForm;
