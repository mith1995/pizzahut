import "../../../styles/checkout.css";
import Navbar from "../../../components/common/Navbar";
import PageHeader from "../../../components/common/PageHeader";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import CheckoutSection from "./CheckoutSection";

function Checkout() {
  return (
    <>
      <Topbar />
      <Navbar />
      <PageHeader title="Checkout" />
      <CheckoutSection />
      <Footer />
    </>
  );
}

export default Checkout;
