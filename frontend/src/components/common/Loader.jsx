function Loader({ text = "Loading" }) {
  return (
    <div className="site-loader" role="status" aria-label="Loading">
      <div className="site-loader__inner">
        <div className="site-loader__mark"></div>
        <div className="site-loader__text">
          {text}
          <span className="site-loader__dot">...</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
