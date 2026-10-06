function TestimonialSection({ children }) {
  return (
    <section id="testim" className="clearfix">
      <div className="container">
        <div className="row">
          <div className="popular_1 text-center clearfix">
            <div className="col-sm-12">
              <h4 className="mgt col_1">Our Backbone</h4>
              <h2>Customer Testimonials</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
