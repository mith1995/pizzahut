import ProductCard from "../Products/ProductCard";

function PopularSection() {
  const popularProducts = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 299,
      image: "img/9.jpg",
      description: "Classic pizza with fresh mozzarella and basil.",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      price: 399,
      image: "img/10.jpg",
      description: "Loaded with pepperoni and mozzarella cheese.",
    },
    {
      id: 3,
      name: "BBQ Chicken Pizza",
      price: 449,
      image: "img/11.jpg",
      description: "Grilled chicken with smoky BBQ sauce.",
    },
    {
      id: 4,
      name: "Four Cheese Pizza",
      price: 379,
      image: "img/12.jpg",
      description: "A delicious blend of four premium cheeses.",
    },
    {
      id: 5,
      name: "Farmhouse Pizza",
      price: 349,
      image: "img/13.jpg",
      description: "Fresh vegetables with mozzarella cheese.",
    },
    {
      id: 6,
      name: "Chicken Tikka Pizza",
      price: 429,
      image: "img/14.jpg",
      description: "Spicy chicken tikka with onions and peppers.",
    },
  ];

  const slides = [];

  for (let i = 0; i < popularProducts.length; i += 3) {
    slides.push(popularProducts.slice(i, i + 3));
  }

  return (
    <section id="popular" className="clearfix">
      <div className="container">
        <div className="row">
          <div className="popular_1 text-center clearfix">
            <div className="col-sm-12">
              <h4 className="mgt col_1">Trending</h4>
              <h2>Our Customers' Top Picks</h2>
              <p>
                Discover the flavors our customers love most, freshly prepared
                with quality ingredients
                <br />
                and served with a passion for great food.
              </p>
            </div>
          </div>
          <div className="popular_2 clearfix">
            <div
              id="carousel-example"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {slides.map((slide, index) => (
                  <div
                    className={`item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <div className="row">
                      {slide.map((product) => (
                        <ProductCard key={product.id} product={product} />
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
                  href="#carousel-example"
                  data-slide="prev"
                ></a>
                <a
                  className="right fa fa-chevron-right btn btn-success"
                  href="#carousel-example"
                  data-slide="next"
                ></a>
              </div>
            </div>
          </div>
          <div className="popular_4 text-center clearfix">
            <div className="col-sm-12 space_all">
              <div className="popular_4m clearfix">
                <h5 className="mgt col_1">Order Online</h5>
                <h1 className="col">Get 10% Off Your First Order</h1>
                <p className="col_3">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                  <br />
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s
                </p>
                <h6>
                  <a className="button" href="#">
                    ORDER ONLINE
                  </a>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularSection;
