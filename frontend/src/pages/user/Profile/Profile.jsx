import "../../../styles/auth.css";
import "../../../styles/customer.css";
import Navbar from "../../../components/common/Navbar";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import ProfileSection from "./ProfileSection";

function Profile() {
  return (
    <>
      <Topbar />
      <Navbar />
      <ProfileSection />
      <Footer />
    </>
  );
}

export default Profile;
