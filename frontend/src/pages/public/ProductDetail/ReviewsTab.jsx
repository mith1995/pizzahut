import { useMemo, useState } from "react";
import RatingStar from "../../../components/common/RatingStar";
import { isLoggedIn } from "../../../utils/auth";

const STAR_LEVELS = [5, 4, 3, 2, 1];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

function Stars({ rating }) {
  return (
    <span
      className="verified-review-stars"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={n <= rating ? "fa fa-star" : "fa fa-star-o"}
          aria-hidden="true"
        ></i>
      ))}
    </span>
  );
}

function ReviewsTab({ reviews, onWriteReview, onEditReview, onDeleteReview }) {
  const {
    summary = { average: 0, count: 0, breakdown: {} },
    can_review = false,
    reviews: list = [],
  } = reviews || {};

  const [sort, setSort] = useState("recent");
  const [starFilter, setStarFilter] = useState(null);

  const visibleReviews = useMemo(() => {
    const filtered = starFilter
      ? list.filter((r) => r.rating === starFilter)
      : list;
    const sorted = [...filtered];
    // "recent": API pehle se naya-pehle bhejta hai. Sort stable hai, to barabar rating mein bhi wahi order rahega.
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating);
    return sorted;
  }, [list, sort, starFilter]);

  const ownReview = list.find((r) => r.is_owner);

  let eligibilityNote = "";
  if (!isLoggedIn()) {
    eligibilityNote = "Login to review products you have ordered.";
  } else if (ownReview) {
    eligibilityNote = "You have already reviewed this product.";
  } else if (!can_review) {
    eligibilityNote = "Only customers who received this product can review it.";
  }

  const toggleFilter = (star) =>
    setStarFilter((current) => (current === star ? null : star));

  return (
    <div className="click clearfix">
      <div className="home_inner clearfix">
        <h3 className="mgt">Customer ratings &amp; reviews</h3>
        <div className="product-rating-dashboard" data-product-rating-dashboard>
          <div className="product-rating-score">
            <strong>
              {summary.count ? Number(summary.average).toFixed(1) : "–"}
            </strong>
            <span
              className="product-rating-stars"
              data-product-rating-stars
              aria-label="No ratings yet"
            ></span>
            <RatingStar className="col_4 pull-right" rating={summary.average} />
            <small data-demo-rating-notice>
              {summary.count} {summary.count === 1 ? "rating" : "ratings"}
            </small>
          </div>

          <div
            className="product-rating-breakdown"
            aria-label="Rating breakdown"
          >
            {STAR_LEVELS.map((star) => {
              const count = summary.breakdown?.[star] ?? 0;
              const percent = summary.count ? (count / summary.count) * 100 : 0;
              return (
                <button
                  key={star}
                  type="button"
                  className="rating-breakdown-row"
                  aria-pressed={starFilter === star}
                  aria-label={`${star} stars: ${count} reviews`}
                  disabled={count === 0}
                  onClick={() => toggleFilter(star)}
                >
                  <span>{star} star</span>
                  <span className="rating-breakdown-track" aria-hidden="true">
                    <span
                      className="rating-breakdown-fill"
                      style={{ width: `${percent}%` }}
                    ></span>
                  </span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="product-rating-action">
            <button
              className="button product-rate-button"
              type="button"
              disabled={!can_review}
              onClick={onWriteReview}
            >
              Rate this product
            </button>
            {eligibilityNote && <span role="status">{eligibilityNote}</span>}
          </div>
        </div>

        <div className="product-review-toolbar">
          <strong>
            {starFilter ? `${starFilter} star reviews` : "Customer reviews"} (
            {visibleReviews.length})
          </strong>
          <label htmlFor="review-sort">Sort by</label>
          <select
            id="review-sort"
            className="form-control"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Most recent</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </div>

        {starFilter && (
          <button
            className="review-filter-clear"
            type="button"
            onClick={() => setStarFilter(null)}
          >
            Clear rating filter
          </button>
        )}

        <div aria-live="polite">
          {visibleReviews.length === 0 && (
            <p>
              {starFilter
                ? "No reviews with this rating."
                : "No reviews yet. Be the first to review this product."}
            </p>
          )}

          {visibleReviews.map((review) => (
            <article key={review.id} className="verified-product-review">
              <h5>
                {review.user_name}
                <Stars rating={review.rating} />
              </h5>
              <small>{formatDate(review.created_at)}</small>
              <p>{review.comment}</p>

              {review.is_owner && (
                <div className="review-actions">
                  <button type="button" onClick={() => onEditReview?.(review)}>
                    Edit
                  </button>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete your review?"))
                        onDeleteReview?.(review);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewsTab;
