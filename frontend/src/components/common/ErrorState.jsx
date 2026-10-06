import Button from "./Button";

function ErrorState({
  title = "Unable to load data",
  message = "Something went wrong. Please try again.",
  buttonText = "Try again",
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-card">
        <div className="error-state-mark" aria-hidden="true">
          !
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        {onRetry && (
          <Button
            type="button"
            className="button auth-submit"
            onClick={onRetry}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
