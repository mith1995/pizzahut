import * as yup from "yup";

export const confirmPasswordSchema = ({
  isRequired = true,
  requiredMessage = "Confirm password is required",
  confirmPasswordMessage = "Password does not match",
  refField = "password",
} = {}) => {
  let schema = yup.string().oneOf([yup.ref(refField)], confirmPasswordMessage);

  if (isRequired) {
    schema = schema.required(requiredMessage);
  }

  return schema;
};
