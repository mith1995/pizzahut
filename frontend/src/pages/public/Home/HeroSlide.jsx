import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import FallbackImage from "../../../components/common/FallbackImage";
import { useAddToCart } from "../../../hooks/useAddToCart";
import { formatPrice } from "../../../utils/helper";

function HeroSlide({ pizza, active }) {
  const { addToCart } = useAddToCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(pizza.variant_id, 1);
      toast.success("Pizza added to cart", {
        duration: 3000,
        icon: "🍕",
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };
  return (
    <div className={`item slides ${active ? "active" : ""}`}>
      <div className={`slide-${pizza.id}`}></div>
      <div className="hero clearfix">
        <div className="col-sm-6">
          <h1 className="mgt">{pizza.name}</h1>
          <p>{pizza.short_description}</p>
          <br />
          <h4>
            <Button className="button big" onClick={handleAddToCart}>
              Order <i className="fa fa-shopping-bag"></i>
            </Button>
          </h4>
          <h4 className="col_1 normal">
            {formatPrice(pizza.price, pizza.currency_symbol)}
          </h4>
        </div>
        <div className="col-sm-6">
          <FallbackImage src={pizza.image} className="iw" alt={pizza.name} />
        </div>
      </div>
    </div>
  );
}

export default HeroSlide;
