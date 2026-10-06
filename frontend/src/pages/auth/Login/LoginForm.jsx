import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../validations/auth.schema";
import { useLoginUserMutation } from "../../../services/api";
import { handleApiErrors } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../features/auth/authSlice";

import FormErrorList from "../../../components/common/FormErrorList";
import AnchorButton from "../../../components/common/AnchorButton";
import Button from "../../../components/common/Button";
import ButtonLoader from "../../../components/common/ButtonLoader";
import FormInput from "../../../components/common/FormInput";
import PasswordInput from "../../../components/common/PasswordInput";
import { useDispatch } from "react-redux";
import { useMergeGuestCartMutation } from "../../../services/cartApi";
import ApiStateHandler from "../../../components/common/ApiStateHandler";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem("email") || "",
      password: localStorage.getItem("password") || "",
      rememberMe: !!localStorage.getItem("email"),
    },
  });

  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const [mergeCart] = useMergeGuestCartMutation();

  const isSubmittingForm = isSubmitting || isLoading;

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();

      dispatch(loginSuccess(response));

      // Cookie RememberMe
      if (data.rememberMe) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      // Merge Guest Cart
      try {
        await mergeCart().unwrap();
      } catch (error) {
        console.log("Error: ", error);
      }

      navigate("/account", {
        replace: true,
      });
    } catch (apiError) {
      handleApiErrors(apiError, setError);
    }
  };

  if (isLoading) {
    return (
      <ApiStateHandler
        isLoading={isLoading}
        loadingTitle="Logged in..."
        loadingMessage=""
      />
    );
  }
  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row auth-card">
          <div className="col-sm-5 auth-visual">
            <span className="auth-kicker">WELCOME BACK</span>
            <h1>Good food is better shared.</h1>
            <p>
              Sign in to save your favourites, track orders and make checkout
              feel effortless.
            </p>
            <AnchorButton className="button_1" href="/registration">
              Create an account <i className="fa fa-arrow-right"></i>
            </AnchorButton>
          </div>
          <div className="col-sm-7 auth-form-wrap">
            <span className="auth-kicker col_1">YOUR TABLE IS READY</span>
            <h2>Sign in</h2>
            <p className="form-intro">Use your account details to continue.</p>

            {isSuccess && (
              <div className="auth-message success" role="alert">
                Login successfull.
              </div>
            )}

            {<FormErrorList error={errors.root?.server} />}

            <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label="Email address"
                name="email"
                type="text"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />

              <PasswordInput
                id="login-password"
                label="Password"
                name="password"
                forgetPasswordHref="/forget-password"
                placeholder="Enter password"
                {...register("password")}
                error={errors.password}
              />

              <label className="check-label">
                <input type="checkbox" {...register("rememberMe")} /> Remember
                me
              </label>

              <Button
                className="button auth-submit"
                type="submit"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? (
                  <>
                    <ButtonLoader />
                    Sign in...
                  </>
                ) : (
                  <>
                    Sign in
                    <i className="fa fa-sign-in"></i>
                  </>
                )}
              </Button>
            </form>
            <p className="auth-switch">
              New to Pizza Restaurant?
              <AnchorButton className="c_text" href="/registration">
                Create your account
              </AnchorButton>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginForm;
