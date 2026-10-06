import Logo from "../common/Logo";
import FooterBottom from "./FooterBottom";
import FooterLinks from "./FooterLinks";

function Footer() {
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
          <FooterLinks />
          <FooterBottom />
        </div>
      </div>
    </section>
  );
}

export default Footer;
