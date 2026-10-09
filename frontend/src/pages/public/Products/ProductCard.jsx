import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FallbackImage from "../../../components/common/FallbackImage";
import { useAddToCart } from "../../../hooks/useAddToCart";
import Button from "../../../components/common/Button";
import { formatPrice } from "../../../utils/helper";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../../services/wishlistProductApi";
import { isLoggedIn } from "../../../utils/auth";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useAddToCart();
  const { data: wishlist = [] } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn(),
    refetchOnMountOrArgChange: true, // page khulte hi fresh data
    refetchOnFocus: true, // tab par wapas aate hi fresh data
    refetchOnReconnect: true,
  });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const isWishlisted = wishlist.some((item) => item.product.id === product.id);

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

  const handleWishlist = async () => {
    try {
      if (!isLoggedIn()) {
        navigate("/login");
        return;
      }

      if (isWishlisted) {
        await removeFromWishlist({ product_id: product.id }).unwrap();
        toast.success("Pizza removed from the wishlist", {
          duration: 3000,
          icon: "🍕",
        });
      } else {
        await addToWishlist({ product_id: product.id }).unwrap();
        toast.success("Pizza added to the wishlist", {
          duration: 3000,
          icon: "🍕",
        });
      }
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
              onClick={handleWishlist}
              disabled={isAdding || isRemoving}
            >
              <i
                className={
                  isWishlisted ? "fa fa-heart like-product" : "fa fa-heart-o"
                }
              ></i>
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
