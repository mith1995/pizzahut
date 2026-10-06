import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../../services/api";
import { loginSuccess } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    async function verify() {
      try {
        const clean_token = token.replaceAll("-", "");
        const data = await verifyEmail(clean_token).unwrap();

        dispatch(loginSuccess(data));

        navigate("/account", {
          replace: true,
        });
      } catch (error) {
        setMessage(error?.data?.detail || "Email verification failed.");
      }
    }

    verify();
  }, [navigate, searchParams, verifyEmail]);

  return <p>{message}</p>;
}

export default VerifyEmailPage;
