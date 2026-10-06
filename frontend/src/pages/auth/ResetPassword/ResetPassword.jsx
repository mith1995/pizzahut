import AuthFooter from "../../../components/layout/AuthFooter";
import AuthHeader from "../../../components/layout/AuthHeader";
import ResetPasswordForm from "./ResetPasswordForm";
import Topbar from "../../../components/common/Topbar";

function ResetPassword() {
  return (
    <>
      <Topbar />
      <AuthHeader />
      <ResetPasswordForm />
      <AuthFooter />
    </>
  );
}

export default ResetPassword;
