function AddressSummary({ address, showCountry = false }) {
  const { address_line1, address_line2, pincode, city, state, country } =
    address;
  return (
    <>
      {address_line1}
      {address_line2 && (
        <>
          <br />
          {address_line2}
        </>
      )}
      <br />
      {[city?.name, state?.name].filter(Boolean).join(", ")} {pincode}
      {showCountry && (
        <>
          <br />
          {country?.name}
        </>
      )}
    </>
  );
}

export default AddressSummary;
