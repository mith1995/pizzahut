import Button from "../../../components/common/Button";
import { getPageNumbers } from "../../../utils/helper";

function OrderPagination({
  currentPage,
  totalPages,
  onPageChange,
  next,
  previous,
}) {
  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  return (
    <nav
      className="live-orders-pagination"
      id="live-orders-pagination"
      aria-label="Order history pages"
    >
      <Button
        type="button"
        className="live-orders-page-control"
        aria-label="Previous page"
        onClick={previous && prevPage}
        disabled={!previous}
      >
        Previous
      </Button>
      {getPageNumbers(currentPage, totalPages).map((item, index) => (
        <>
          <Button
            key={`${item}-${index}`}
            type="button"
            className={`live-orders-page-number ${item === currentPage && "active"}`}
            aria-label={item === "..." ? "More pages" : `Page ${item}`}
            onClick={() => item !== "..." && onPageChange(item)}
            disabled={item === "..."}
          >
            {item}
          </Button>
        </>
      ))}
      <Button
        type="button"
        className="live-orders-page-control"
        aria-label="Next page"
        onClick={next && nextPage}
        disabled={!next}
      >
        Next
      </Button>
    </nav>
  );
}

export default OrderPagination;
