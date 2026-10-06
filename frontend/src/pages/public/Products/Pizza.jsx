import "../../../styles/list.css";
import Navbar from "../../../components/common/Navbar";
import PageHeader from "../../../components/common/PageHeader";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import PizzaSection from "./PizzaSection";

function Pizza() {
  return (
    <>
      <Topbar />
      <Navbar />
      <PageHeader title="Pizza Listing" />
      <PizzaSection />
      <Footer />
    </>
  );
}

export default Pizza;
