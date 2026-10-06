import AuthFooter from "../../../components/layout/AuthFooter";
import AuthHeader from "../../../components/layout/AuthHeader";
import RegistrationForm from "./RegistrationForm";
import Topbar from "../../../components/common/Topbar";

function Registration() {
  return (
    <>
      <Topbar />
      <AuthHeader />
      <RegistrationForm />
      <AuthFooter />
    </>
  );
}

export default Registration;
