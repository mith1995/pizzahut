import { useEffect } from "react";

function Modal({
  show,
  onClose,
  title,
  subTitle,
  cancelBtn = "Cancel",
  submitBtn = "Submit",
  formId,
  children,
  isDisabled = false,
}) {
  useEffect(() => {
    document.body.classList.toggle("modal-open", show);

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);
  return (
    <>
      <div
        className="modal fade address-modal in"
        id="addressModal"
        style={{ display: "block" }}
        onClick={() => onClose(false)}
      >
        <div
          className="modal-dialog"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={() => onClose(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <p className="checkout-eyebrow">{title}</p>
              <h3 className="modal-title" id="addressModalTitle">
                {subTitle}
              </h3>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="address-cancel"
                data-dismiss="modal"
                onClick={() => onClose(false)}
              >
                {cancelBtn}
              </button>
              <button
                type="submit"
                className="address-save"
                form={formId}
                disabled={isDisabled}
              >
                {submitBtn}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade in"></div>
    </>
  );
}

export default Modal;
