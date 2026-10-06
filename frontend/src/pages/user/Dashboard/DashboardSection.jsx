import OrderCard from "../../../components/cards/OrderCard";
import AnchorButton from "../../../components/common/AnchorButton";
import UserHeader from "../../../components/common/UserHeader";
import Sidebar from "../../../components/layout/Sidebar";
import BoxCard from "./BoxCard";

function DashboardSection() {
  return (
    <main class="customer-main">
      <div class="customer-wrap">
        <UserHeader
          kicker="YOUR PIZZA PROFILE"
          title="Profile dashboard"
          description="Everything you need for a smoother order."
        />
        <div class="customer-layout">
          <Sidebar />
          <section class="customer-content">
            <div class="stat-row">
              <BoxCard total="04" label="Total Orders" />
              <BoxCard total="02" label="Wishlist Items" />
              <BoxCard total="01" label="Saved Address" />
            </div>
            <div class="customer-panel">
              <h2>Welcome back</h2>
              <p>
                Track your orders, update your details and keep your favourite
                pizzas close.
              </p>
              <p>
                <AnchorButton className="button" href="/account/orders">
                  Order something delicious <i class="fa fa-arrow-right"></i>
                </AnchorButton>
              </p>
            </div>
            <div class="customer-panel">
              <h3>
                Latest order
                <span class="tag success pull-right">Delivered</span>
              </h3>
              <OrderCard />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default DashboardSection;
