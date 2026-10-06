import { Link } from "react-router-dom";
import FallbackImage from "../../../components/common/FallbackImage";

function GalleryImage({ image }) {
  return (
    <div className="col-sm-4 space_all">
      <div className="click_1">
        <div className="page">
          <Link className="sb" to={image.fullImage}>
            <FallbackImage
              src={image.thumbnail}
              alt={image.alt}
              height="300"
              className="iw"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GalleryImage;
