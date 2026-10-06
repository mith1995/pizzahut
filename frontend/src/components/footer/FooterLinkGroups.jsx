import { Link } from "react-router-dom";

function FooterLinkGroups({ title, links }) {
  return (
    <div className="col-sm-3">
      <div className="footer_1i1 clearfix">
        <h4 className="col">{title}</h4>
        {links.map((link) => (
          <h6 key={link.label}>
            <Link className="col_2" to={link.to}>
              {link.label}
            </Link>
          </h6>
        ))}
      </div>
    </div>
  );
}

export default FooterLinkGroups;
