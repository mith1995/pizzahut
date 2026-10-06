import AuthFooter from "../../../components/layout/AuthFooter";
import AuthHeader from "../../../components/layout/AuthHeader";
import ForgetPasswordForm from "./ForgetPasswordForm";
import Topbar from "../../../components/common/Topbar";

function ForgetPassword() {
  return (
    <>
      <Topbar />
      <AuthHeader />
      <ForgetPasswordForm />
      <AuthFooter />
    </>
  );
}

export default ForgetPassword;
