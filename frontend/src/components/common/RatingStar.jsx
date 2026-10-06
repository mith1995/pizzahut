function RatingStar({ className = "", rating = 0, maxRating = 5 }) {
  const safeRating = Math.min(Math.max(Number(rating) || 0, 0), maxRating);
  return (
    <span className={`${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;

        if (safeRating >= starNumber) {
          return <i key={index} className="fa fa-star"></i>;
        }

        if (safeRating === starNumber - 0.5) {
          return <i key={index} className="fa fa-star-half-o"></i>;
        }

        return <i key={index} className="fa fa-star-o"></i>;
      })}
    </span>
  );
}

export default RatingStar;
