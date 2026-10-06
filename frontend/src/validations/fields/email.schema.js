import * as yup from "yup";

export const emailSchema = ({
  isRequired = true,
  requiredMessage = "Email is required",
  emailMessage = "Invalid Email",
} = {}) => {
  let schema = yup.string().email(emailMessage);

  if (isRequired) {
    schema = schema.required(requiredMessage);
  }

  return schema;
};
