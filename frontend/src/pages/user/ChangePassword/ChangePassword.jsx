import Navbar from "../../../components/common/Navbar";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import ChangePasswordForm from "./ChangePasswordForm";

function ChangePassword() {
  return (
    <>
      <Topbar />
      <Navbar />
      <ChangePasswordForm />
      <Footer />
    </>
  );
}

export default ChangePassword;
