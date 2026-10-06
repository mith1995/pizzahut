import ErrorState from "./ErrorState";
import ProductState from "./ProductState";

function ApiStateHandler({
  isLoading = false,
  isError = false,
  error,
  refetch,
  loadingTitle = "Loading...",
  loadingMessage = "Please wait while we fetch the data.",
  errorTitle = "Unable to load data",
  errorMessage = "Something went wrong. Please try again in a moment.",
}) {
  if (!isLoading && !isError) {
    return null;
  }

  if (isLoading) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState
            type="loading"
            title={loadingTitle}
            message={loadingMessage}
          />
        </div>
      </section>
    );
  }

  const isConnectionError = !error?.status;

  return (
    <section id="list" className="clearfix">
      <div className="container">
        <ErrorState
          title={
            isConnectionError ? "We can't connect to the server" : errorTitle
          }
          message={
            isConnectionError
              ? "Please check your connection and try again."
              : errorMessage
          }
          onRetry={refetch}
        />
      </div>
    </section>
  );
}

export default ApiStateHandler;
