import "../../../styles/index.css";
import Topbar from "../../../components/common/Topbar";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/footer/Footer";
import HeroSection from "./HeroSection";
import OfferSection from "./OfferSection";
import AboutSection from "../../../components/common/AboutSection";
import TrendingBlock from "../../../components/common/TrendingBlock";
import PopularSection from "./PopularSection";
import TestimonialSection from "../../../components/testimonials/TestimonialSection";
import TestimonialCarousel from "../../../components/testimonials/TestimonialCarousel";
import GallerySection from "./GallerySection";

function Home() {
  const pizzaItems = [
    {
      id: 1,
      name: "Pepperoni Pizza",
      price: 16.99,
      description:
        "Classic pepperoni pizza with mozzarella cheese and rich tomato sauce.",
    },
    {
      id: 2,
      name: "Four Cheese",
      price: 12.99,
      description:
        "A delicious combination of mozzarella, cheddar, parmesan and blue cheese.",
    },
    {
      id: 3,
      name: "Vegetarian",
      price: 16.99,
      description:
        "Fresh vegetables, mozzarella cheese and tomato sauce on a crispy crust.",
    },
    {
      id: 4,
      name: "Barbeque Chicken",
      price: 12.99,
      description: "Grilled chicken, BBQ sauce, onions and mozzarella cheese.",
    },
    {
      id: 5,
      name: "Ham & Cheese",
      price: 16.99,
      description:
        "Tender ham with melted mozzarella cheese and our special tomato sauce.",
    },
    {
      id: 6,
      name: "Specialty Pizza",
      price: 12.99,
      description:
        "Our chef's special pizza made with premium toppings and fresh ingredients.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      title: "The Modern.",
      message:
        "The modern 5 * Hotel Sochi Center is an ideal solution for combining business and leisure.",
      name: "Eget Nulla",
      country: "USA",
      image: "/img/16.jpg",
    },
    {
      id: 2,
      title: "Nice Hotel!",
      message:
        "Stylish design and exceptional service will satisfy the desires of any guest.",
      name: "Dapibus Diam",
      country: "Australia",
      image: "/img/17.jpg",
    },
    {
      id: 3,
      title: "Perfect Stay.",
      message:
        "Exceptional service and comfortable rooms made our stay wonderful.",
      name: "Semper Porta",
      country: "India",
      image: "/img/18.jpg",
    },
    {
      id: 4,
      title: "Galaxy Hotel.",
      message:
        "The modern 5 * Hotel Sochi Center is an ideal solution for combining business and leisure.",
      name: "Peter",
      country: "USA",
      image: "/img/16.jpg",
    },
    {
      id: 5,
      title: "Seven Star Hotem",
      message:
        "Stylish design and exceptional service will satisfy the desires of any guest.",
      name: "Dippa Bhanu",
      country: "Australia",
      image: "/img/17.jpg",
    },
    {
      id: 6,
      title: "Japan Market",
      message:
        "Exceptional service and comfortable rooms made our stay wonderful.",
      name: "Kim Joe",
      country: "India",
      image: "/img/18.jpg",
    },
  ];
  return (
    <>
      <Topbar />
      <Navbar />
      <HeroSection />
      <OfferSection />
      <AboutSection
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
      <section id="trending" className="clearfix">
        <TrendingBlock
          image="img/7.jpg"
          subtitle="Pizza menu"
          titel="Our Passion, Our Heritage, Our Pizzas"
          description="Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s"
          pizzaItems={pizzaItems}
        />
        <TrendingBlock
          image="img/8.jpg"
          subtitle="Burger menu"
          description="Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s"
          pizzaItems={pizzaItems}
          reverse={true}
        />
      </section>
      <PopularSection />
      <TestimonialSection>
        <TestimonialCarousel testimonials={testimonials} />
      </TestimonialSection>
      <GallerySection />
      <Footer />
    </>
  );
}

export default Home;
