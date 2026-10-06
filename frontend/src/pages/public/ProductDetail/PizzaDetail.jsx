import Navbar from "../../../components/common/Navbar";
import PageHeader from "../../../components/common/PageHeader";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import PizzaDetailSection from "./PizzaDetailSection";

function PizzaDetail() {
  return (
    <>
      <Topbar />
      <Navbar />
      <PageHeader title="Pizza Detail" />
      <PizzaDetailSection />
      <Footer />
    </>
  );
}

export default PizzaDetail;
