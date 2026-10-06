import "../../../styles/auth.css";
import Topbar from "../../../components/common/Topbar";
import AuthHeader from "../../../components/layout/AuthHeader";
import LoginForm from "./LoginForm";
import AuthFooter from "../../../components/layout/AuthFooter";

function Login() {
  return (
    <>
      <Topbar />
      <AuthHeader />
      <LoginForm />
      <AuthFooter />
    </>
  );
}

export default Login;
