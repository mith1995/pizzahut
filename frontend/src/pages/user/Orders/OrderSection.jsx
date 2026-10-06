import { useState } from "react";
import ProductState from "../../../components/common/ProductState";
import UserHeader from "../../../components/common/UserHeader";
import Sidebar from "../../../components/layout/Sidebar";
import { useGetOrdersQuery } from "../../../services/ordersApi";
import EmptyOrder from "./EmptyOrder";
import OrderCard from "./OrderCard";
import OrderPagination from "./OrderPagination";

function OrderSection() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOrdersQuery({ page });

  if (isLoading) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState type="loading" title="Loading Orders..." />
        </div>
      </section>
    );
  }
  return (
    <main className="customer-main">
      <div className="customer-wrap">
        {
          <UserHeader
            kicker="YOUR PIZZA HISTORY"
            title="My orders"
            description="Keep an eye on every slice."
          />
        }
        <div className="customer-layout">
          <Sidebar />
          <section className="customer-content">
            <div className="customer-panel">
              {!data?.count ? (
                <EmptyOrder />
              ) : (
                <>
                  <div className="live-orders-list" id="live-orders-list">
                    <div className="live-orders-heading">
                      <div>
                        <span
                          className="section-eyebrow"
                          id="live-orders-kicker"
                        >
                          YOUR RECENT PURCHASES
                        </span>
                        <h3 id="live-orders-title">Order history</h3>
                      </div>
                    </div>
                    <p
                      id="live-orders-error"
                      className="order-tracking-feedback"
                      hidden
                    ></p>
                    <p
                      className="live-orders-preview-note"
                      id="live-orders-preview-note"
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
                      Design preview only — these sample orders are not real
                      purchases.
                    </p>
                    <p
                      className="live-orders-count"
                      id="live-orders-count"
                      aria-live="polite"
                    >
                      Showing {data?.start_index} - {data?.end_index} of{" "}
                      {data?.count} sample orders
                    </p>
                    <div id="live-order-cards">
                      {data?.results.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                  <OrderPagination
                    currentPage={page}
                    totalPages={data.total_pages}
                    onPageChange={setPage}
                    next={data?.next}
                    previous={data?.previous}
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default OrderSection;
