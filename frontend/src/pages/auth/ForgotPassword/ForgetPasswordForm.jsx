import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../../validations/auth.schema";
import { useForgotPasswordMutation } from "../../../services/api";
import AnchorButton from "../../../components/common/AnchorButton";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";
import ButtonLoader from "../../../components/common/ButtonLoader";
import FormErrorList from "../../../components/common/FormErrorList";
import { handleApiErrors } from "../../../utils/helper";

function ForgetPasswordForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      reset();
    } catch (apiError) {
      handleApiErrors(apiError, setError);
    }
  };

  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row auth-card">
          <div className="col-sm-5 auth-visual">
            <span className="auth-kicker">NO WORRIES</span>
            <h1>Let us bring you back to your table.</h1>
            <p>Enter your email and we will send a password reset link.</p>
          </div>
          <div className="col-sm-7 auth-form-wrap">
            <span className="auth-kicker col_1">RESET ACCESS</span>
            <h2>Forgot password?</h2>
            <p className="form-intro">
              We will send instructions to your inbox.
            </p>

            {isSuccess && (
              <div className="auth-message success" role="alert">
                Reset password sent on your email.
              </div>
            )}

            <FormErrorList error={errors.root?.server} />

            <form id="forgot-form" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label="Email address"
                id="forgot-email"
                name="email"
                type="text"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />
              <Button
                className="button auth-submit"
                type="submit"
                disabled={isSubmittingForm}
              >
                {isSubmitting ? (
                  <>
                    <ButtonLoader />
                    Send reset link...
                  </>
                ) : (
                  <>
                    Send reset link
                    <i className="fa fa-paper-plane"></i>
                  </>
                )}
              </Button>
            </form>
            <p className="auth-switch">
              <AnchorButton className="c_text" href="/login">
                Back to sign in
              </AnchorButton>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgetPasswordForm;
