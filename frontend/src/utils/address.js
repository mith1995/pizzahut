export const ADDRESS_TYPES = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export const EMPTY_ADDRESS_FORM = {
  address_type: null,
  country: null,
  state: null,
  city: null,
  address_line1: "",
  address_line2: "",
  pincode: "",
};

const toOption = (obj) => (obj ? { value: obj.id, label: obj.name } : null);

// API address -> form values
export const addressToFormValues = (a) => ({
  address_type: ADDRESS_TYPES.find((t) => t.value === a.address_type) ?? null,
  country: toOption(a.country),
  state: toOption(a.state),
  city: toOption(a.city),
  address_line1: a.address_line1 ?? "",
  address_line2: a.address_line2 ?? "",
  pincode: a.pincode ?? "",
});

// form values -> API payload
export const formToAddressPayload = (d) => ({
  address_type: d.address_type.value,
  country_id: d.country.value,
  state_id: d.state?.value ?? null,
  city_id: d.city?.value ?? null,
  pincode: d.pincode,
  address_line1: d.address_line1,
  address_line2: d.address_line2 || "",
});
