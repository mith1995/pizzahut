import { Link } from "react-router-dom";
import FallbackImage from "../../../components/common/FallbackImage";

function WhatsNewSection() {
  return (
    <section id="trend">
      <div className="container">
        <div className="row">
          <div className="popular_1 text-center clearfix">
            <div className="col-sm-12">
              <h2 className="mgt">What’s New</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br /> Lorem Ipsum has been the industry's standard dummy
              </p>
            </div>
          </div>
          <div className="trend_1 clearfix">
            <div className="col-sm-6">
              <div className="trend_1i clearfix">
                <div className="col-sm-5 space_all">
                  <div className="trend_1il clearfix">
                    <FallbackImage src="img/7.jpg" className="iw" alt="abc" />
                  </div>
                </div>
                <div className="col-sm-7 space_all">
                  <div className="trend_1ir clearfix">
                    <h6 className="mgt">June 1, 2018</h6>
                    <h5 className="bold">Solar Cells With Nanostripes</h5>
                    <p>
                      June 2, 2017 — Solar cells based on perovskites reach high
                      efficiencies: they convert more than 20 percent of the
                      incident light directly into usable power.
                    </p>
                    <h5>
                      <Link className="button mgt">Read More</Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="trend_1i clearfix">
                <div className="col-sm-5 space_all">
                  <div className="trend_1il clearfix">
                    <FallbackImage src="img/8.jpg" className="iw" alt="abc" />
                  </div>
                </div>
                <div className="col-sm-7 space_all">
                  <div className="trend_1ir clearfix">
                    <h6 className="mgt">June 1, 2018</h6>
                    <h5 className="bold">A Glow Stick Detects Cancer?</h5>
                    <p>
                      June 2, 2017 — Solar cells based on perovskites reach high
                      efficiencies: they convert more than 20 percent of the
                      incident light directly into usable power.
                    </p>
                    <h5>
                      <Link className="button mgt">Read More</Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatsNewSection;
