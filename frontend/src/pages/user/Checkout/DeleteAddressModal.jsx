import Modal from "../../../components/common/Modal";
import AddressSummary from "./AddressSummary";

function DeleteAddressModal({ address, isDeleting, onConfirm, onClose }) {
  return (
    <Modal
      show
      onClose={onClose}
      title="DELETE ADDRESS"
      subTitle="Are you sure you want to delete this address?"
      submitBtn={isDeleting ? "Deleting..." : "Delete"}
      formId="delete-address-form"
    >
      <div className="delete-confirmation">
        <p>Are you sure you want to delete this address?</p>
        <div className="delete-address-preview">
          <strong>{address?.address_type}</strong>
          <p>
            <AddressSummary address={address} />
          </p>
        </div>
        <form
          id="delete-address-form"
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        />
      </div>
    </Modal>
  );
}

export default DeleteAddressModal;
