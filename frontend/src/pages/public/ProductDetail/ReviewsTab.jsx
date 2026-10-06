import Review from "./Review";

function ReviewsTab({ reviews }) {
  return (
    <div className="click clearfix">
      <div className="home_inner clearfix">
        <h3 className="mgt">{reviews.length} Reviews</h3>
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

export default ReviewsTab;
