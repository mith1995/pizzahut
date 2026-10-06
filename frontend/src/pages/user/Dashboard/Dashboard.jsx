import "../../../styles/auth.css";
import "../../../styles/customer.css";
import Navbar from "../../../components/common/Navbar";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import DashboardSection from "./DashboardSection";

function Dashboard() {
  return (
    <>
      <Topbar />
      <Navbar />
      <DashboardSection />
      <Footer />
    </>
  );
}

export default Dashboard;
