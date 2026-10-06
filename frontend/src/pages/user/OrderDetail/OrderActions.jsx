import { useState } from "react";
import {
  useCancelOrderMutation,
  useRequestReturnMutation,
} from "../../../services/ordersApi";
import Modal from "../../../components/common/Modal";

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "Other",
];

const RETURN_REASONS = [
  { value: "damaged", label: "Item arrived damaged" },
  { value: "wrong_item", label: "Wrong item received" },
  { value: "not_as_described", label: "Not as described" },
  { value: "size_issue", label: "Size / fit issue" },
  { value: "quality_issue", label: "Quality issue" },
  { value: "other", label: "Other" },
];

const RETURN_LABEL = {
  requested: "Return request sent",
  approved: "Return approved, pickup soon",
  picked_up: "Item picked up",
  received: "Item received, refund processing",
  refunded: "Refund completed",
};

function getHelpText(order) {
  const refundInProgress = ["refunded", "refund_pending"].includes(
    order.payment?.status,
  );

  if (order.status === "cancelled") {
    return refundInProgress
      ? "This order was cancelled. Your refund is being processed."
      : "This order was cancelled.";
  }
  if (order.status === "returned") {
    return "This order has been returned and refunded.";
  }
  if (order.can_return) {
    return "Not happy with your order? You can request a return.";
  }
  if (order.active_return) {
    return "Your return request is in progress.";
  }
  if (order.status === "delivered") {
    return "The return window for this order has closed.";
  }
  if (!order.can_cancel) {
    return "This order can no longer be cancelled.";
  }
  return "You can cancel before your order ships.";
}

function OrderActions({ order }) {
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [requestReturn, { isLoading: isReturning }] =
    useRequestReturnMutation();

  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const isBusy = isCancelling || isReturning;
  const isCancel = modal === "cancel";

  const openModal = (type) => {
    setReason("");
    setComment("");
    setFeedback({ type: "", text: "" });
    setModal(type);
  };

  const closeModal = () => {
    if (!isBusy) setModal(null);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      const res = await cancelOrder({
        id: order.id,
        reason: reason || "Not specified",
      }).unwrap();
      setModal(null);
      setFeedback({
        type: "success",
        text: res?.message ?? "Order cancelled.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.data?.message ?? "Could not cancel the order.",
      });
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (reason === "other" && !comment.trim()) {
      setFeedback({ type: "error", text: "Please describe the issue." });
      return;
    }
    try {
      const res = await requestReturn({
        id: order.id,
        reason,
        comment: comment.trim(),
      }).unwrap();
      setModal(null);
      setFeedback({
        type: "success",
        text: res?.message ?? "Return request submitted.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.data?.message ?? "Could not submit the return request.",
      });
    }
  };

  return (
    <>
      <section className="order-actions-panel" aria-label="Order actions">
        <div className="order-actions-copy">
          <span className="section-eyebrow">ORDER OPTIONS</span>
          <h3>Need to make a change?</h3>
          <p className="order-action-help">{getHelpText(order)}</p>
        </div>
        <div className="order-actions" aria-live="polite">
          {order.can_cancel && (
            <button
              className="order-cancel-link"
              data-order-action="cancel"
              type="button"
              onClick={() => openModal("cancel")}
            >
              <i className="fa fa-times-circle"></i> Cancel order
            </button>
          )}

          {order.can_return && (
            <button
              className="order-return-link"
              type="button"
              onClick={() => openModal("return")}
            >
              <i className="fa fa-undo"></i> Return / replace item
            </button>
          )}

          {order.active_return && (
            <span className="order-action-unavailable">
              <i className="fa fa-clock-o"></i>{" "}
              {RETURN_LABEL[order.active_return.status] ??
                order.active_return.status_display}
            </span>
          )}
        </div>
      </section>

      {feedback.text && !modal && (
        <p className={`order-tracking-feedback ${feedback.type}`} role="status">
          {feedback.text}
        </p>
      )}

      {modal && (
        <Modal
          show
          onClose={closeModal}
          title={isCancel ? "CANCEL ORDER" : "RETURN ITEM"}
          subTitle={isCancel ? "Cancel this order?" : "Return an item"}
          cancelBtn={isCancel ? "Keep order" : "Close"}
          submitBtn={
            isCancel
              ? isCancelling
                ? "Cancelling..."
                : "Yes, cancel order"
              : isReturning
                ? "Submitting..."
                : "Submit return request"
          }
          formId="order-action-form"
          isDisabled={isBusy}
        >
          <form
            id="order-action-form"
            onSubmit={isCancel ? handleCancel : handleReturn}
          >
            <p>
              {isCancel
                ? "This can't be undone. If you've already paid, we'll refund it."
                : "Tell us what went wrong and we'll arrange a pickup."}
            </p>

            <div className="form-group">
              <label htmlFor="order-reason">Reason</label>
              <select
                id="order-reason"
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required={!isCancel}
              >
                <option value="">Select a reason</option>
                {isCancel
                  ? CANCEL_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))
                  : RETURN_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
              </select>
            </div>

            {!isCancel && (
              <div className="form-group">
                <label htmlFor="order-comment">Comments</label>
                <textarea
                  id="order-comment"
                  className="form-control"
                  rows={3}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add details (required if you chose Other)"
                />
              </div>
            )}

            {feedback.type === "error" && (
              <p className="order-tracking-feedback error">{feedback.text}</p>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}

export default OrderActions;
