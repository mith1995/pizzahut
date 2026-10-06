import StarRating from "../../../components/common/StarRating";

function AddReviewForm() {
  return (
    <div className="click clearfix">
      <div className="home_inner clearfix">
        <h3 className="mgt">Leave a Review</h3>
        <div className="review-rating">
          <StarRating size={25} />
          <span className="span_2">Your Review</span>
        </div>
        <div className="home_inner_i clearfix">
          <div className="col-sm-6 space_left">
            <input
              className="form-control"
              placeholder="Full Name"
              type="text"
            />
          </div>
          <div className="col-sm-6 space_right">
            <input
              className="form-control"
              placeholder="Enter Email"
              type="text"
            />
          </div>
        </div>
        <div className="home_inner_i clearfix">
          <div className="col-sm-6 space_left">
            <input className="form-control" placeholder="Subject" type="text" />
          </div>
          <div className="col-sm-6 space_right">
            <input
              className="form-control"
              placeholder="Phone Number"
              type="text"
            />
          </div>
        </div>
        <div className="home_inner_i clearfix">
          <div className="col-sm-12 space_all">
            <textarea
              placeholder="Review"
              className="form-control form_1"
            ></textarea>
            <h5>
              <a className="button" href="#">
                Submit Review
              </a>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReviewForm;
