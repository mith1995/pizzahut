import AnchorButton from "./AnchorButton";

function Topbar() {
  return (
    <section id="top">
      <div className="container">
        <div className="row">
          <div className="top_1 clearfix">
            <div className="col-sm-6">
              <div className="top_1l clearfix">
                <h5 className="normal mgt font_16">
                  <a className="col" href="#">
                    <i className="fa fa-phone font_18 align_middle col_1"></i>{" "}
                    1234567890{" "}
                    <i className="fa fa-envelope ms_10 font_18 align_middle col_1"></i>{" "}
                    info@gmail.com
                  </a>
                </h5>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="top_1r text-right clearfix">
                <h6 className="mgt">
                  <AnchorButton className="button mgt" href="/pizzas">
                    Order Online
                  </AnchorButton>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
