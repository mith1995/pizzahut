import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Modal from "../../../components/common/Modal";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
} from "../../../services/reviewsApi";

const schema = yup.object({
  rating: yup
    .number()
    .typeError("Please select a rating")
    .min(1, "Please select a rating")
    .max(5)
    .required("Please select a rating"),
  comment: yup
    .string()
    .trim()
    .required("Please write a few words about the product")
    .max(1000, "Maximum 1000 characters"),
});

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          style={{
            background: "none",
            border: 0,
            padding: 2,
            fontSize: 28,
            cursor: "pointer",
            color: "#f5a623",
          }}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          <i
            className={n <= active ? "fa fa-star" : "fa fa-star-o"}
            aria-hidden="true"
          ></i>
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ onClose, productSlug, productName, initialRating = 0 }) {
  const { data } = useGetReviewsQuery(productSlug);
  const ownReview = data?.reviews?.find((r) => r.is_owner);
  const isEdit = Boolean(ownReview);

  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: ownReview?.rating ?? initialRating,
      comment: ownReview?.comment ?? "",
    },
  });

  // Purana review baad mein aaye to form bhar do. Primitives par depend karte hain,
  // taaki refetch par user ka likha hua text na mit jaye.
  const ownId = ownReview?.id;
  const ownRating = ownReview?.rating;
  const ownComment = ownReview?.comment;
  useEffect(() => {
    if (ownId) reset({ rating: ownRating, comment: ownComment });
  }, [ownId, ownRating, ownComment, reset]);

  const onSubmit = async ({ rating, comment }) => {
    try {
      if (isEdit) {
        await updateReview({
          slug: productSlug,
          id: ownReview.id,
          rating,
          comment,
        }).unwrap();
        toast.success("Review updated");
      } else {
        await addReview({ slug: productSlug, rating, comment }).unwrap();
        toast.success("Thanks for your review!");
      }
      onClose(false);
    } catch (error) {
      toast.error(
        error?.data?.errors?.non_field_errors?.[0] ||
          error?.data?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <Modal
      show
      onClose={onClose}
      title={productName || "Your review"}
      subTitle={isEdit ? "Edit your review" : "Rate this product"}
      submitBtn={isEdit ? "Update review" : "Submit review"}
      formId="review-form"
      isDisabled={isAdding || isUpdating}
    >
      <form id="review-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Your rating</label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarInput value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && (
            <small className="text-danger">{errors.rating.message}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="review-comment">Your review</label>
          <textarea
            id="review-comment"
            className="form-control"
            rows={4}
            maxLength={1000}
            placeholder="How was the taste, quantity, packaging?"
            {...register("comment")}
          />
          {errors.comment && (
            <small className="text-danger">{errors.comment.message}</small>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default ReviewModal;
