import * as yup from "yup";

export const phoneSchema = ({
  isRequired = true,
  requiredMessage = "Phone number is required",
  requiredTenDigit = true,
} = {}) => {
  let schema = yup.string();

  if (isRequired) {
    schema = schema.required(requiredMessage);
  }
  if (requiredTenDigit) {
    schema = schema.matches(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number");
  }

  return schema;
};
