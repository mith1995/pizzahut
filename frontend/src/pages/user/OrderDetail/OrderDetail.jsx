import Navbar from "../../../components/common/Navbar";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import OrderDetailSection from "./OrderDetailSection";

function OrderDetail() {
  return (
    <>
      <Topbar />
      <Navbar />
      <OrderDetailSection />
      <Footer />
    </>
  );
}

export default OrderDetail;
