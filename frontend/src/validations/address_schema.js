import * as yup from "yup";
export const addressSchema = yup.object({
  address_type: yup.object().nullable().required("Address type is required"),
  country: yup.object().nullable().required("Country is required"),
  state: yup
    .object()
    .nullable()
    .when("$hasStates", {
      is: true,
      then: (schema) => schema.required("State is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  city: yup
    .object()
    .nullable()
    .when("$hasCities", {
      is: true,
      then: (schema) => schema.required("City is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  address_line1: yup
    .string()
    .trim()
    .required("Address is required")
    .matches(/^[a-zA-Z0-9,.\s-]+$/, {
      message: "Address in special characters are not allowed",
      excludeEmptyString: true,
    }),
  address_line2: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9,.\s-]+$/, {
      message: "Address in special characters are not allowed",
      excludeEmptyString: true,
    }),
  pincode: yup
    .string()
    .required("Pincode is required")
    .min(6, "Minimum 6 characters enter"),
});
