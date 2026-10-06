import { Link } from "react-router-dom";

function AnchorButton({ className = "", href = "/", children, ...rest }) {
  return (
    <Link className={className} to={href} {...rest}>
      {children}
    </Link>
  );
}

export default AnchorButton;
