import * as yup from "yup";
import { phoneSchema } from "./fields/phone.schema";
import { emailSchema } from "./fields/email.schema";
import { passwordSchema } from "./fields/password.schema";
import { confirmPasswordSchema } from "./fields/confirm_password.schema";

export const profileSchema = yup.object({
  first_name: yup
    .string()
    .trim()
    .required("First name is required")
    .matches(/^[A-Za-z\s]+$/, "Only alphabates allowed"),
  last_name: yup
    .string()
    .trim()
    .required("Last name is required")
    .matches(/^[A-Za-z\s]+$/, "Only alphabates allowed"),
  phone: phoneSchema(),
  email: emailSchema(),
});

export const changePasswordSchema = yup.object({
  current_password: passwordSchema({
    requiredMessage: "Current password is required",
  }),
  new_password: passwordSchema({
    requiredMessage: "New password is required",
  }),
  confirm_password: confirmPasswordSchema({ refField: "new_password" }),
});
