import { Link } from "react-router-dom";
import UserHeader from "../../../components/common/UserHeader";
import Sidebar from "../../../components/layout/Sidebar";
import { useGetWishlistQuery } from "../../../services/wishlistProductApi";
import WishlistProductCard from "./WishlistProductCard";

function WishlistSection() {
  const { data: pizzas = [] } = useGetWishlistQuery(undefined, {
    refetchOnMountOrArgChange: true, // page khulte hi fresh data
    refetchOnFocus: true, // tab par wapas aate hi fresh data
    refetchOnReconnect: true,
  });
  return (
    <main className="customer-main">
      <div className="customer-wrap">
        {
          <UserHeader
            kicker="SAVED FOR LATER"
            title="Wishlist"
            description="Your next order is already halfway decided."
          />
        }
        <div className="customer-layout">
          <Sidebar />

          {pizzas.length > 0 ? (
            <section className="customer-content">
              <div class="customer-panel wishlist-panel">
                <div className="item-grid">
                  {pizzas.map((pizza) => (
                    <WishlistProductCard
                      key={pizza.product.id}
                      product={pizza.product}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section class="customer-content">
              <div class="customer-panel wishlist-panel">
                <div class="wishlist-toolbar">
                  <p
                    id="wishlist-count-label"
                    class="wishlist-count-label"
                    aria-live="polite"
                  ></p>
                </div>
                <div class="item-grid" aria-live="polite">
                  <div
                    class="wishlist-empty"
                    id="wishlist-empty-state"
                    role="status"
                  >
                    <span>
                      <i class="fa fa-heart-o"></i>
                    </span>
                    <h3>Your wishlist is empty</h3>
                    <p>
                      Save your favourite pizzas and keep them ready for your
                      next order.
                    </p>
                    <Link class="button" to="/pizzas">
                      Browse the menu <i class="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
                <nav
                  class="live-orders-pagination shared-pagination"
                  id="wishlist-pagination"
                  aria-label="Wishlist pages"
                  hidden
                ></nav>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default WishlistSection;
