import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useRemoveCartItem } from "../../hooks/useRemoveCartItem";
import { formatPrice } from "../../utils/helper";

function CartItem({ item }) {
  const { removeCartItem } = useRemoveCartItem();

  const price = item.variant.price;
  const quantity = item.quantity;
  const currency_symbol = item.variant.currency_symbol;
  const product_slug = item.variant.product_slug;
  const product_name = item.variant.product_name;
  const product_image = item.variant.product_image;

  const handleDeleteToCart = async () => {
    try {
      await removeCartItem(item.variant.id);
      toast.success("Pizza deleted to cart", {
        duration: 3000,
        icon: "🍕",
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="drop_1i1 clearfix">
      <div className="col-sm-6">
        <div className="drop_1i1l clearfix">
          <h6 className="mgt bold">
            <Link to={`/pizza/${product_slug}`}>{product_name}</Link>
            <br />
            <span className="normal col_2 font_14">
              {quantity}x - {formatPrice(price, currency_symbol)}
            </span>
          </h6>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="drop_1i1r text-right clearfix">
          <img
            src={product_image}
            className="iw"
            height="70"
            alt={product_name}
          />
        </div>
      </div>
      <div className="col-sm-2">
        <div className="drop_1i1r drop_1i1rn text-right clearfix">
          <button onClick={handleDeleteToCart}>
            <span>
              <i className="fa fa-trash"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
