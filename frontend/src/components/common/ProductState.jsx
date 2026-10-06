// components/common/ProductState.jsx

import { ArrowPathIcon } from "@heroicons/react/24/outline";

function ProductState({ type = "error", title, message, onRetry }) {
  const isLoading = type === "loading";
  const isEmpty = type === "empty";

  return (
    <div className={`product-state ${type}`}>
      <div className="product-state-card">
        {/* {isLoading && <div className="product-spinner" aria-hidden="true" />} */}
        {isLoading && <div className="site-loader__mark" aria-hidden="true" />}

        {type === "error" && (
          <div className="product-state-icon error-icon">!</div>
        )}

        {isEmpty && <div className="product-state-icon empty-icon">🍕</div>}

        <h3>{title}</h3>

        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="btn btn-primary product-retry-btn"
            onClick={onRetry}
          >
            <ArrowPathIcon
              className="retry-icon"
              width={17}
              height={17}
              aria-hidden="true"
            />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductState;
