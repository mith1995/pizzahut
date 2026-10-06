import { useState } from "react";

function FallbackImage({ src = "", alt = "", className = "", ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  const handleError = () => {
    setImageSrc("/img/placeholder-image.png");
    setIsPlaceholder(true);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isPlaceholder ? "placeholder-img" : ""}`}
      onError={handleError}
      {...props}
    />
  );
}

export default FallbackImage;
