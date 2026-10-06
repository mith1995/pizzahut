import { useState } from "react";
import DescriptionTab from "./DescriptionTab";
import ReviewsTab from "./ReviewsTab";
import AddReviewForm from "./AddReviewForm";

function PizzaTabs({ description, reviews }) {
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className="list_detail_2 clearfix">
      <div className="col-sm-8">
        <div className="list_detail_2l clearfix">
          <ul className="nav_1 mgt">
            <li className={`${activeTab === "description" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("description");
                }}
              >
                Description
              </a>
            </li>
            <li className={`${activeTab === "reviews" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("reviews");
                }}
              >
                Reviews ({reviews?.length})
              </a>
            </li>
            <li className={`${activeTab === "review-form" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("review-form");
                }}
              >
                Add Review
              </a>
            </li>
          </ul>
          <div className="tab-content clearfix">
            {activeTab === "description" && (
              <DescriptionTab description={description} />
            )}
            {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
            {activeTab === "review-form" && <AddReviewForm />}
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="list_detail_2r clearfix"></div>
      </div>
    </div>
  );
}

export default PizzaTabs;
