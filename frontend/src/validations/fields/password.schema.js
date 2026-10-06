import * as yup from "yup";

export const passwordSchema = ({
  min = 8,
  max = 16,
  isMinLenRequired = true,
  isMaxLenRequired = true,
  isRequired = true,
  requiredMessage = "Password is required",
  requireLowercase = true,
  requireUppercase = true,
  requireNumber = true,
  requireSpecial = true,
} = {}) => {
  let schema = yup.string();

  if (isMinLenRequired) {
    schema = schema.min(min, `Password must be at least ${min} characters`);
  }

  if (isMaxLenRequired) {
    schema = schema.max(max, `Password maximum ${max} characters allowed`);
  }

  if (isRequired) {
    schema = schema.required(requiredMessage);
  }

  if (requireLowercase) {
    schema = schema.matches(
      /[a-z]/,
      "At least one lowercase letter is required",
    );
  }

  if (requireUppercase) {
    schema = schema.matches(
      /[A-Z]/,
      "At least one uppercase letter is required",
    );
  }

  if (requireNumber) {
    schema = schema.matches(/\d/, "At least one number is required");
  }

  if (requireSpecial) {
    schema = schema.matches(
      /[@$!%*?&]/,
      "At least one special character is required, (@$!%*?&)",
    );
  }

  return schema;
};
