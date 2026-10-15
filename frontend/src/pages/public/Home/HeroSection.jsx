/* global $ -- jQuery is loaded via <script> in index.html */
import { useEffect, useState } from "react";
import HeroSlide from "./HeroSlide";
import ProductState from "../../../components/common/ProductState";

function HeroSection({ slides, isLoading, isError }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const carousel = $("#bs-carousel");

    carousel.on("slid.bs.carousel", function (event) {
      setActiveIndex(event.to);
    });

    return () => {
      carousel.off("slid.bs.carousel");
    };
  }, []);

  if (isLoading) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState type="loading" />
        </div>
      </section>
    );
  }

  if (isError) return null;

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
                  {slides.map((pizza, index) => (
                    <li
                      key={pizza.id}
                      data-target="#bs-carousel"
                      data-slide-to={index}
                      className={activeIndex === index ? "active" : ""}
                    ></li>
                  ))}
                </ol>

                <div className="carousel-inner">
                  {slides.map((pizza, index) => (
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
