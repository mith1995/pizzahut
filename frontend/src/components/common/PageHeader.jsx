import { Link } from "react-router-dom";

function PageHeader({ title }) {
  return (
    <section id="center" className="center_o clearfix">
      <div className="container">
        <div className="row">
          <div className="center_o_1 text-center clearfix">
            <div className="col-sm-12">
              <h1 className="mgt">{title}</h1>
              <h5 className="col_2 normal">
                <Link to="/">Home</Link> | {title}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageHeader;
