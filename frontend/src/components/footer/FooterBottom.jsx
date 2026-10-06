import { Link } from "react-router-dom";

function FooterBottom() {
  return (
    <>
      <div className="footer_2 clearfix">
        <div className="col-sm-12">
          <ul>
            <li>
              <Link className="col_2" to="/">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="col_2" to="/">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link className="col_2" to="/">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link className="col_2" to="/">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="footer_3 clearfix">
        <div className="col-sm-12">
          <p className="mgt small_tag col_3">
            © 2013 Your Website Name. All Rights Reserved | Design by{" "}
            <a className="col_1" href="http://www.templateonweb.com">
              TemplateOnWeb
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default FooterBottom;
