import AnchorButton from "../../../components/common/AnchorButton";
import FallbackImage from "../../../components/common/FallbackImage";

function HeroSlide({ pizza, active }) {
  return (
    <div className={`item slides ${active ? "active" : ""}`}>
      <div className={`slide-${pizza.id}`}></div>
      <div className="hero clearfix">
        <div className="col-sm-6">
          <h1 className="mgt">{pizza.title}</h1>
          <h3>{pizza.subtitle}</h3>
          <p>{pizza.description}</p>
          <h5 className="normal">
            {pizza.calories} <br />
            <span className="col_1">Calories</span>
          </h5>
          <h5 className="normal">
            {pizza.cheese} <br />
            <span className="col_1">Mazarella</span>
          </h5>
          <br />
          <h4>
            <AnchorButton className="button big">
              Order <i className="fa fa-shopping-bag"></i>
            </AnchorButton>
          </h4>
          <h4 className="col_1 normal">${pizza.price.toFixed(2)}</h4>
        </div>
        <div className="col-sm-6">
          <FallbackImage src={pizza.image} className="iw" alt={pizza.title} />
        </div>
      </div>
    </div>
  );
}

export default HeroSlide;
