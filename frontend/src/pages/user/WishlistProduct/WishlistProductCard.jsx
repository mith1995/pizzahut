import { Link } from "react-router-dom";
import FallbackImage from "../../../components/common/FallbackImage";
import { formatPrice } from "../../../utils/helper";
import { useRemoveFromWishlistMutation } from "../../../services/wishlistProductApi";
import toast from "react-hot-toast";
import { useAddToCart } from "../../../hooks/useAddToCart";
import Button from "../../../components/common/Button";

function WishlistProductCard({ product }) {
  const { addToCart } = useAddToCart();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

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
      await removeFromWishlist({ product_id: product.id }).unwrap();
      toast.success("Pizza removed from the wishlist", {
        duration: 3000,
        icon: "🍕",
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  return (
    <div class="food-card" data-wishlist-item={product.image}>
      <FallbackImage src={product.image} className="iw" alt={product.name} />
      <h4>
        <Link to={`/pizzas/${product.slug}`}>{product.name}</Link>
      </h4>
      <p>{product.short_description}</p>
      <span class="price">
        {formatPrice(product.price, product.currency_symbol)}
      </span>
      <div class="wishlist-card-actions">
        <Button className="button" onClick={handleAddToCart}>
          Add To Bag
        </Button>
        <button
          class="button wishlist-remove"
          type="button"
          data-remove-wishlist-item
          aria-label="Remove Classic Pepperoni from wishlist"
          disabled={isRemoving}
          onClick={handleWishlist}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistProductCard;
