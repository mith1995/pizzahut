import FallbackImage from "./FallbackImage";

function TrendingBlock({
  image,
  subtitle,
  title,
  description,
  pizzaItems,
  reverse = false,
}) {
  return (
    <div className={`trending_1 clearfix  ${reverse ? "reverse" : ""}`}>
      <div className="col-sm-6 space_all">
        <div className="trending_1l clearfix">
          <FallbackImage src={image} className="iw" alt={title} />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="trending_1r clearfix">
          <h5 className="mgt col_1">{subtitle}</h5>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="trending_1ri clearfix">
            {pizzaItems.map((pizza) => (
              <div key={pizza.id} className="col-sm-6 space_left">
                <div className="trending_1ril clearfix">
                  <h5>
                    {pizza.name}
                    <span className="pull-right col_1">
                      $ {pizza.price.toFixed(2)}
                    </span>
                  </h5>
                  <p>{pizza.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingBlock;
