import { Link } from "react-router-dom";
import FallbackImage from "../common/FallbackImage";

function OfferCard({ offer, index }) {
  const isEven = index % 2 === 0;
  const cardClass = isEven ? "offer_1i" : "offer_1io";
  const imageClass = isEven ? "offer_1il" : "";
  return (
    <div className="col-sm-4">
      <div className={`${cardClass} clearfix`}>
        <div className="col-sm-6 space_all">
          <div className={`${imageClass} clearfix`}>
            <Link to="/">
              <FallbackImage
                src={offer.image}
                alt={offer.title}
                className="iw"
              />
            </Link>
          </div>
        </div>
        <div className="col-sm-6 space_right">
          <div className="offer_1ir clearfix">
            <h4 className="mgt">
              <Link className={`${isEven ? "col_4" : "col_1"}`} to="/">
                {offer.title}
              </Link>
            </h4>
            <h5>
              <Link className="col" to="/">
                ${offer.price.toFixed(2)}
              </Link>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferCard;
