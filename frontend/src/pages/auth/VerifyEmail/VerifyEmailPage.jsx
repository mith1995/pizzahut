import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../../services/api";
import { loginSuccess } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const clean_token = token.replaceAll("-", "");
        const data = await verifyEmail(clean_token).unwrap();

        dispatch(loginSuccess(data));

        navigate("/account", {
          replace: true,
        });
      } catch (error) {
        setErrorMessage(error?.data?.detail || "Email verification failed.");
      }
    }

    verify();
  }, [dispatch, navigate, token, verifyEmail]);

  const message = !token
    ? "Verification token is missing."
    : errorMessage || "Verifying your email...";

  return <p>{message}</p>;
}

export default VerifyEmailPage;
