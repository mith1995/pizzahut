import "../../../styles/about.css";
import WhatsNewSection from "./WhatsNewSection";
import AboutSection from "../../../components/common/AboutSection";
import Navbar from "../../../components/common/Navbar";
import PageHeader from "../../../components/common/PageHeader";
import Topbar from "../../../components/common/Topbar";
import Footer from "../../../components/footer/Footer";
import WhyDifferentSection from "./WhyDifferentSection";
import TeamSection from "./TeamSection";

function About() {
  return (
    <>
      <Topbar />
      <Navbar />
      <PageHeader title="About Us" />
      <AboutSection
        className="clearfix bgn"
        image="img/6.jpg"
        subtitle="Sir Slice's Heritage"
        title="Serving Pizzas By The Slice Since 1987"
        paragraphs={[
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s ",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        ]}
        buttonText="CHECK OUR MENU"
        buttonLink="/menu"
      />
      <WhatsNewSection />
      <WhyDifferentSection />
      <TeamSection />
      <Footer />
    </>
  );
}

export default About;
