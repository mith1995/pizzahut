import { useState } from "react";
import DescriptionTab from "./DescriptionTab";
import ReviewsTab from "./ReviewsTab";
import Button from "../../../components/common/Button";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
} from "../../../services/reviewsApi";
import { useParams } from "react-router-dom";
import ProductState from "../../../components/common/ProductState";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";

function PizzaTabs({ description }) {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("description");

  const { data, isLoading } = useGetReviewsQuery(slug);
  const [deleteReview] = useDeleteReviewMutation();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const handleWriteReview = () => setReviewModalOpen(true);
  const handleEditReview = () => setReviewModalOpen(true); // modal khud is_owner wala review dhundh leta hai

  const handleDeleteReview = async (review) => {
    try {
      await deleteReview({ slug, id: review.id }).unwrap();
      toast.success("Review deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isLoading)
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState type="loading" title="Loading Reviews..." />
        </div>
      </section>
    );
  return (
    <>
      <div className="list_detail_2 clearfix">
        <div className="col-sm-8">
          <div className="list_detail_2l clearfix">
            <ul className="nav_1 mgt">
              <li className={`${activeTab === "description" ? "active" : ""}`}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("description");
                  }}
                >
                  Description
                </Button>
              </li>
              <li className={`${activeTab === "reviews" ? "active" : ""}`}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("reviews");
                  }}
                >
                  Reviews ({data.summary.count})
                </Button>
              </li>
            </ul>
            <div className="tab-content clearfix">
              {activeTab === "description" && (
                <DescriptionTab description={description} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab
                  reviews={data}
                  onWriteReview={handleWriteReview}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="list_detail_2r clearfix"></div>
        </div>
      </div>

      {reviewModalOpen && (
        <ReviewModal
          onClose={() => setReviewModalOpen(false)}
          productSlug={slug}
          // productName={...}   // agar product ka naam yahan available ho, nahi to hata do
        />
      )}
    </>
  );
}

export default PizzaTabs;
