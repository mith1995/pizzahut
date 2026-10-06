import Logo from "../common/Logo";
import FooterBottom from "../footer/FooterBottom";

function AuthFooter() {
  return (
    <section id="footer" className="clearfix">
      <div className="container">
        <div className="row">
          <div className="footer_1t clearfix">
            <div className="col-sm-12">
              <h3 className="mgt">
                <Logo className="col" />
              </h3>
            </div>
          </div>
          <FooterBottom />
        </div>
      </div>
    </section>
  );
}

export default AuthFooter;
