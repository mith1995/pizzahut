import "../../../styles/cart.css";
import Topbar from "../../../components/common/Topbar";
import Navbar from "../../../components/common/Navbar";
import PageHeader from "../../../components/common/PageHeader";
import Footer from "../../../components/footer/Footer";
import CartSection from "./CartSection";
function Cart() {
  return (
    <>
      <Topbar />
      <Navbar />
      <PageHeader title="Shopping Cart" />
      <CartSection />
      <Footer />
    </>
  );
}

export default Cart;
