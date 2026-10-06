import { Link } from "react-router-dom";
import FallbackImage from "./FallbackImage";

function AboutSection({
  className = "",
  image,
  title,
  subtitle,
  paragraphs,
  buttonText,
  buttonLink,
}) {
  return (
    <section id="about_h" className={className}>
      <div className="container">
        <div className="row">
          <div className="about_h1 clearfix">
            <div className="col-sm-6">
              <div className="about_h1l clearfix">
                <FallbackImage src={image} className="iw" alt={title} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="about_h1r clearfix">
                <h5 className="mgt">{title}</h5>
                <h1>{subtitle}</h1>

                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <h5>
                  <Link className="button" to={buttonLink}>
                    {buttonText}
                  </Link>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
