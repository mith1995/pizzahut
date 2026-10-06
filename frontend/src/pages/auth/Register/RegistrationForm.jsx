import AnchorButton from "../../../components/common/AnchorButton";
import Button from "../../../components/common/Button";
import ButtonLoader from "../../../components/common/ButtonLoader";
import FormErrorList from "../../../components/common/FormErrorList";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { registerSchema } from "../../../validations/auth.schema";
import { useRegisterUserMutation } from "../../../services/api";
import { handleApiErrors } from "../../../utils/helper";
import FormInput from "../../../components/common/FormInput";
import PasswordInput from "../../../components/common/PasswordInput";

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    // mode: "onTouched",
    // reValidateMode: "onChange",
  });

  const [registerUser, { isLoading, isSuccess }] = useRegisterUserMutation();

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    const { fullname, ...rest } = data;

    const nameParts = fullname.trim().split(/\s+/);

    const payload = {
      ...rest,
      first_name: nameParts.shift() || "",
      last_name: nameParts.join(" "),
    };

    try {
      const response = await registerUser(payload).unwrap();
      reset();
      console.log("Registration successful:", response);
    } catch (apiError) {
      handleApiErrors(apiError, setError, {
        // Only needed if frontend/backend names differ
        // confirm_password: "confirmPassword",
      });
    }
  };
  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row auth-card">
          <div className="col-sm-5 auth-visual">
            <span className="auth-kicker">JOIN THE TABLE</span>
            <h1>Your next favourite pizza is waiting.</h1>
            <p>
              Create an account to reorder faster, save your address and keep
              every order close.
            </p>
            <AnchorButton className="button_1" href="/login">
              Already a member <i className="fa fa-arrow-right"></i>
            </AnchorButton>
          </div>
          <div className="col-sm-7 auth-form-wrap">
            <span className="auth-kicker col_1">FRESH START</span>
            <h2>Create account</h2>
            <p className="form-intro">It only takes a minute to get started.</p>

            {isSuccess && (
              <div className="auth-message success" role="alert">
                Registration successful. Please check your email.
              </div>
            )}

            {<FormErrorList error={errors.root?.server} />}

            <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-sm-6">
                  <FormInput
                    id="register-fullname"
                    label="Full name"
                    name="fullname"
                    type="text"
                    placeholder="Your name"
                    {...register("fullname")}
                    error={errors.fullname}
                  />
                </div>
                <div className="col-sm-6">
                  <FormInput
                    id="register-phone"
                    label="Phone number"
                    name="phone"
                    type="text"
                    placeholder="123 456 7890"
                    {...register("phone")}
                    error={errors.phone}
                  />
                </div>
              </div>

              <FormInput
                id="register-email"
                label="Email address"
                name="email"
                type="text"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />

              <PasswordInput
                id="register-password"
                label="Password"
                name="password"
                placeholder="Enter password"
                {...register("password")}
                error={errors.password}
              />

              <PasswordInput
                id="register-confirm-password"
                label="Confirm Password"
                name="confirm_password"
                placeholder="Enter Confirm password"
                {...register("confirm_password")}
                error={errors.confirm_password}
              />

              <label className="check-label">
                <input
                  id="register-terms"
                  type="checkbox"
                  {...register("terms")}
                />{" "}
                I agree to the <a href="#">Terms and Services</a>
              </label>
              {errors.terms && <p className="error">{errors.terms?.message}</p>}

              <Button
                className="button auth-submit"
                type="submit"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? (
                  <>
                    <ButtonLoader />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <i className="fa fa-user-plus"></i>
                  </>
                )}
              </Button>
            </form>
            <p className="auth-switch">
              Already have an account?
              <AnchorButton className="c_text" href="/login">
                Sign in
              </AnchorButton>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegistrationForm;
