import { Link } from "react-router-dom";

function Logo({ className = "navbar-brand" }) {
  return (
    <>
      <Link className={className} to="/">
        <i className="fa fa-apple col_4"></i> Pizza <br />
        <span className="col_1">Restaurant </span>
      </Link>
    </>
  );
}

export default Logo;
