function AddressCard({ data, onEdit, onDelete, onChangeDefault }) {
  const addressType = data.address_type;
  const addressLine1 = data.address_line1;
  const addressLine2 = data.address_line2;
  const pincode = data.pincode;
  const city = data.city.name;
  const state = data.state.name;
  const country = data.country.name;
  const isDefault = data.is_default;

  return (
    <div className="saved-address-option">
      <input
        id={`delivery-address-home-${data.id}`}
        name="checkout-addresses"
        type="radio"
        value={data.id}
        checked={isDefault}
        onChange={() => {
          onChangeDefault();
        }}
      />
      <label
        className="saved-address-card"
        htmlFor={`delivery-address-home-${data.id}`}
      >
        <span className="saved-address-card-top">
          <strong>{addressType}</strong>
          {isDefault && <span className="address-default">Default</span>}
        </span>
        <span className="saved-address-detail">
          {addressLine1}
          {addressLine2 && (
            <>
              <br />
              {addressLine2}
            </>
          )}
          <br />
          {city}, {state} {pincode}
          <br />
          {country}
        </span>
        {isDefault && (
          <span className="saved-address-check" aria-hidden="true">
            <i className="fa fa-check-circle"></i>
          </span>
        )}
      </label>
      <span className="saved-address-actions">
        <button
          className="address-action"
          type="button"
          aria-label="Edit Home address"
          title="Edit address"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </button>
        <button
          className="address-action address-action-delete"
          type="button"
          aria-label="Delete Home address"
          title="Delete address"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </span>
    </div>
  );
}

export default AddressCard;
