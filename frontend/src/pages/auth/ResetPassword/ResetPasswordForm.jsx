import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../../../validations/auth.schema";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";
import ButtonLoader from "../../../components/common/ButtonLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../../services/api";
import { handleApiErrors } from "../../../utils/helper";
import FormErrorList from "../../../components/common/FormErrorList";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    try {
      data.uid = uid;
      data.token = token;
      await resetPassword(data).unwrap();
      reset();
      navigate("/login");
    } catch (apiError) {
      handleApiErrors(apiError, setError);
    }
  };

  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row auth-card">
          <div className="col-sm-5 auth-visual">
            <span className="auth-kicker">FRESH START</span>
            <h1>A better password, then back to the good stuff.</h1>
            <p>Set a new password for your Pizza Restaurant account.</p>
          </div>
          <div className="col-sm-7 auth-form-wrap">
            <span className="auth-kicker col_1">RESET PASSWORD</span>
            <h2>Choose a new password</h2>
            <p className="form-intro">Use at least 8 characters.</p>

            {isSuccess && (
              <div className="auth-message success" role="alert">
                Password Reset successfully.
              </div>
            )}

            {<FormErrorList error={errors.root?.server} />}

            <form id="reset-form" onSubmit={handleSubmit(onSubmit)}>
              <PasswordInput
                id="register-password"
                label="New Password"
                name="new_password"
                placeholder="Enter a secure password"
                {...register("new_password")}
                error={errors.new_password}
              />

              <PasswordInput
                id="register-confirm-password"
                label="Confirm Password"
                name="confirm_password"
                placeholder="Enter a confirm password"
                {...register("confirm_password")}
                error={errors.confirm_password}
              />

              <Button
                className="button auth-submit"
                type="submit"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? (
                  <>
                    <ButtonLoader />
                    Set new password...
                  </>
                ) : (
                  <>
                    Set new password
                    <i className="fa fa-check"></i>
                  </>
                )}
              </Button>
            </form>
            <p className="auth-switch">
              <a className="c_text" href="login.html">
                Back to sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordForm;
