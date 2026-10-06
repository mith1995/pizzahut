import TestimonialCard from "./TestimonialCard";

function TestimonialCarousel({ testimonials }) {
  const slides = [];

  for (let i = 0; i < testimonials.length; i += 3) {
    slides.push(testimonials.slice(i, i + 3));
  }
  return (
    <>
      <div className="testim_1 clearfix">
        <div
          id="carousel-example1"
          className="carousel slide"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`item ${index === 0 ? "active" : ""}`}
              >
                <div className="row">
                  {slide.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="popular_3 text-center clearfix">
        <div className="col-sm-12">
          <div className="controls">
            <a
              className="left fa fa-chevron-left btn btn-success"
              href="#carousel-example1"
              data-slide="prev"
            ></a>
            <a
              className="right fa fa-chevron-right btn btn-success"
              href="#carousel-example1"
              data-slide="next"
            ></a>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestimonialCarousel;
