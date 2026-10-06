import { Link } from "react-router-dom";
import { getPageNumbers } from "../../utils/helper";

function Pagination({ currentPage, totalPages, onPageChange, next, previous }) {
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
    <ul>
      {previous && (
        <li>
          <Link onClick={prevPage}>
            <i className="fa fa-chevron-left"></i>
          </Link>
        </li>
      )}

      {getPageNumbers(currentPage, totalPages).map((item, index) => (
        <li key={index} className={item === currentPage ? "act" : ""}>
          {item === "..." ? (
            <span>...</span>
          ) : (
            <Link onClick={() => onPageChange(item)}>{item}</Link>
          )}
        </li>
      ))}

      {next && (
        <li>
          <Link onClick={nextPage}>
            <i className="fa fa-chevron-right"></i>
          </Link>
        </li>
      )}
    </ul>
  );
}

export default Pagination;
