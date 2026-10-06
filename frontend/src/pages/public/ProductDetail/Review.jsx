import { formatDate } from "../../../utils/helper";
import FallbackImage from "../../../components/common/FallbackImage";
import RatingStar from "../../../components/common/RatingStar";

function Review({ review }) {
  return (
    <div className="detail_1l4i clearfix">
      <div className="col-sm-2 space_left">
        <FallbackImage
          src={review.user.image}
          className="iw img-circle"
          alt={review.user.name}
        />
      </div>
      <div className="col-sm-10">
        <h5 className="bold mgt col_1">
          {review.user.name}
          {<RatingStar className="col_4 pull-right" rating={review.rating} />}
        </h5>
        <h6>{formatDate(review.createdAt)}</h6>
        <p>{review.comment}</p>
      </div>
    </div>
  );
}

export default Review;
