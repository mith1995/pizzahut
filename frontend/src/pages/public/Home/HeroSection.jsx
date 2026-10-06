import { useEffect, useState } from "react";
import HeroSlide from "./HeroSlide";

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroSlides = [
    {
      id: 1,
      title: "Nulla Quis Libero",
      subtitle: "Ham & Cheese With Vegetables",
      description:
        "Nulla quis sem at nibh elementum imperdiet Fusce nec tellus sed augue semper porta Vestibulum lacinia arcu eget nulla!",
      calories: "900",
      cheese: "400g",
      price: 66,
      image: "img/3.jpg",
    },
    {
      id: 2,
      title: "Sed Augue Semper",
      subtitle: "Ham & Cheese With Vegetables",
      description:
        "Nulla quis sem at nibh elementum imperdiet Fusce nec tellus sed augue semper porta Vestibulum lacinia arcu eget nulla!",
      calories: "900",
      cheese: "400g",
      price: 69,
      image: "img/4.jpg",
    },
    {
      id: 3,
      title: "Fusce Nec Dapibus",
      subtitle: "Ham & Cheese With Vegetables",
      description:
        "Nulla quis sem at nibh elementum imperdiet Fusce nec tellus sed augue semper porta Vestibulum lacinia arcu eget nulla!",
      calories: "900",
      cheese: "400g",
      price: 49,
      image: "img/5.jpg",
    },
  ];

  useEffect(() => {
    const carousel = $("#bs-carousel");

    carousel.on("slid.bs.carousel", function (event) {
      setActiveIndex(event.to);
    });

    return () => {
      carousel.off("slid.bs.carousel");
    };
  }, []);
  return (
    <>
      <section id="center" className="center_home clearfix">
        <div className="container">
          <div className="row">
            <div className="center_home_1 clearfix">
              <div
                className="carousel fade-carousel slide"
                data-ride="carousel"
                data-interval="4000"
                id="bs-carousel"
              >
                <div className="overlay"></div>

                <ol className="carousel-indicators">
                  {heroSlides.map((pizza, index) => (
                    <li
                      key={pizza.id}
                      data-target="#bs-carousel"
                      data-slide-to={index}
                      className={activeIndex === index ? "active" : ""}
                    ></li>
                  ))}
                </ol>

                <div className="carousel-inner">
                  {heroSlides.map((pizza, index) => (
                    <HeroSlide
                      key={pizza.id}
                      pizza={pizza}
                      active={index === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
