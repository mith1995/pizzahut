import * as yup from "yup";
import { emailSchema } from "./fields/email.schema";
import { passwordSchema } from "./fields/password.schema";
import { phoneSchema } from "./fields/phone.schema";
import { confirmPasswordSchema } from "./fields/confirm_password.schema";

export const loginSchema = yup.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const registerSchema = yup.object({
  fullname: yup
    .string()
    .trim()
    .required("Full name is required")
    .matches(/^[A-Za-z\s]+$/, "Only alphabates allowed"),
  phone: phoneSchema(),
  email: emailSchema(),
  password: passwordSchema(),
  confirm_password: confirmPasswordSchema(),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema(),
});

export const resetPasswordSchema = yup.object({
  new_password: passwordSchema({ requiredMessage: "New password is required" }),
  confirm_password: confirmPasswordSchema({ refField: "new_password" }),
});
