import * as yup from "yup";
import { emailSchema } from "./fields/email.schema";
import { phoneSchema } from "./fields/phone.schema";

export const checkoutSchema = yup.object({
  first_name: yup.string().trim().required("First name is required"),
  last_name: yup.string().trim().required("Last name is required"),
  email: emailSchema({
    isRequired: true,
    emailMessage: "Enter a valid email",
  }),
  phone: phoneSchema(),
});
