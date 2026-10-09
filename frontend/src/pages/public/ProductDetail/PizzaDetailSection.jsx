import { useGetWishlistQuery } from "../../../services/wishlistProductApi";
import { isLoggedIn } from "../../../utils/auth";
import ProductCard from "../Products/ProductCard";
import PizzaInfo from "./PizzaInfo";

function PizzaDetailSection() {
  const { data: pizzas = [] } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn(),
    refetchOnMountOrArgChange: true, // page khulte hi fresh data
    refetchOnFocus: true, // tab par wapas aate hi fresh data
    refetchOnReconnect: true,
  });

  return (
    <section id="list" className="clearfix">
      <div className="container">
        <div className="row">
          <PizzaInfo />
          {Boolean(pizzas.length) && (
            <>
              <br />
              <div className="list_detail_3 clearfix">
                <div className="col-sm-12">
                  <h2 className="mgt">You might also like</h2>
                </div>
              </div>

              <div className="list_1 clearfix">
                {pizzas.map((pizza) => (
                  <ProductCard key={pizza.product.id} product={pizza.product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default PizzaDetailSection;
