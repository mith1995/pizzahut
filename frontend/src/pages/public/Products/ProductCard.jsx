import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import FallbackImage from "../../../components/common/FallbackImage";
import { useAddToCart } from "../../../hooks/useAddToCart";
import Button from "../../../components/common/Button";
import { formatPrice } from "../../../utils/helper";

function ProductCard({ product }) {
  const [favorite, setFavorite] = useState(false);
  const { addToCart } = useAddToCart();

  const image = product.image;
  const slug = product.slug;
  const name = product.name;
  const price = product.price;
  const short_description = product.short_description;
  const currency_symbol = product.currency_symbol;

  const handleAddToCart = async () => {
    try {
      await addToCart(product.variant_id, 1);
      toast.success("Pizza added to cart", {
        duration: 3000,
        icon: "🍕",
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="col-sm-4 food-card-col">
      <div className="popular_2i clearfix">
        <FallbackImage src={image} className="iw" alt={name} />
      </div>
      <div className="popular_2i1 text-center clearfix">
        <h3 className="mgt">
          <Link to={`/pizzas/${slug}`}>{name}</Link>
        </h3>
        <p>{short_description}</p>
        <div className="price-favorite">
          <span className="span_1">
            <a href="javascript:void(0)" className="col_1">
              {formatPrice(price, currency_symbol)}
            </a>
          </span>
          <span className="span_2">
            <button
              type="button"
              className="favorite-btn"
              onClick={() => setFavorite(!favorite)}
            >
              <i className={favorite ? "fa fa-heart" : "fa fa-heart-o"}></i>
            </button>
          </span>
        </div>
        <hr />
        <div className="card-actions">
          <Button className="button" onClick={handleAddToCart}>
            Add To Bag
          </Button>

          <Link className="button_1" to={`/pizzas/${slug}`}>
            CUSTOMIZE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
