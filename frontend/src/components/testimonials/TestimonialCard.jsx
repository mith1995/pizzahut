import FallbackImage from "../common/FallbackImage";

function TestimonialCard({ testimonial }) {
  return (
    <div className="col-sm-4">
      <div className="testim1 clearfix">
        <h4 className="mgt">{testimonial.title}</h4>
        <p>{testimonial.message}</p>
        <div className="testim_1i2i clearfix">
          <FallbackImage
            src={testimonial.image}
            className="img-circle"
            alt={testimonial.name}
          />
          <div className="testimonial-user">
            <h4 className="col_1 mgt">{testimonial.name}</h4>
            <span className="small_tag col_2">From {testimonial.country}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
