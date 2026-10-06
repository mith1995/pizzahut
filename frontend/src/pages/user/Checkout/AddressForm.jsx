import { useState } from "react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import AddressCard from "./AddressCard";
import {
  useCreatAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSelectAddressMutation,
  useUpdateAddressMutation,
} from "../../../services/accountsApi";
import ApiStateHandler from "../../../components/common/ApiStateHandler";
import { runAction } from "../../../utils/apiHelpers";
import AddressFormModal from "./AddressFormModal";
import DeleteAddressModal from "./DeleteAddressModal";
import { useFormContext } from "react-hook-form";

function AddressForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [formModal, setFormModal] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const { data, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useCreatAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [selectAddress] = useSelectAddressMutation();

  // Create and update Address
  const handleSave = async (payload) => {
    const address = formModal.address;

    const { ok } = address
      ? await runAction(
          () =>
            updateAddress({
              address_id: address.id,
              data: payload,
            }),
          { success: "Address updated successfully" },
        )
      : await runAction(() => addAddress({ ...payload, is_default: true }), {
          success: "Address created successfully",
        });
    if (ok) setFormModal(null);
  };

  const handleDelete = async () => {
    const { ok } = await runAction(
      () =>
        deleteAddress({
          address_id: deletingAddress.id,
        }),
      {
        success: "Address deleted successfully",
        fallbackError: "Unable to delete address",
      },
    );
    if (ok) setDeletingAddress(null);
  };

  const handleSelect = async (address) => {
    runAction(() => selectAddress({ address_id: address.id }), {
      success: "Default address updated successfully",
    });
  };

  // All Variables
  const addresses = data?.addresses || [];
  const maxAllowed = data?.max_allowed;
  const createdCount = data?.created;
  const canAddMore = data?.can_add_more;

  if (isLoading)
    <ApiStateHandler isLoading={isLoading} loadingTitle="Loading..." />;

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
                placeholder="e.g. Ayesha"
                {...register("first_name")}
                error={errors.first_name}
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Last name"
                id="last-name"
                placeholder="e.g. Khan"
                {...register("last_name")}
                error={errors.last_name}
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Email address"
                id="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />
            </div>
            <div className="checkout-field">
              <FormInput
                label="Phone number"
                id="phone"
                placeholder="Your contact number"
                {...register("phone")}
                error={errors.phone}
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
                onEdit={() => setFormModal({ address })}
                onDelete={() => setDeletingAddress(address)}
                onChangeDefault={() => handleSelect(address)}
              />
            ))}
          </div>
          {canAddMore && (
            <Button
              className="add-address-trigger"
              onClick={() => setFormModal({ address: null })}
            >
              <i className="fa fa-plus" aria-hidden="true"></i> Add a new
              address
            </Button>
          )}
        </div>
      </section>
      {formModal && (
        <AddressFormModal
          address={formModal.address}
          isSaving={isAdding || isUpdating}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {deletingAddress && (
        <DeleteAddressModal
          address={deletingAddress}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onClose={() => setDeletingAddress(null)}
        />
      )}
    </>
  );
}

export default AddressForm;
