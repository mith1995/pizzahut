import { useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useLazyGetInvoicePdfQuery,
} from "../../../services/ordersApi";
import ApiStateHandler from "../../../components/common/ApiStateHandler";
import { formatAddress, longDateFormat } from "../../../utils/helper";
import OrderProductCard from "./OrderProductCard";
import PaymentSection from "./PaymentSection";
import OrderPaymentSummary from "./OrderPaymentSummary";
import OrderStatusTimeline from "./OrderStatusTimeline";
import OrderActions from "./OrderActions";
import AnchorButton from "../../../components/common/AnchorButton";

function OrderDetailSection() {
  const { orderId } = useParams();
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const [getInvoice, { isFetching }] = useLazyGetInvoicePdfQuery();

  const { street, region } = formatAddress(order?.shipping_address_snapshot);
  const canDownloadInvoice = !["pending", "cancelled"].includes(order?.status);

  const handleInvoice = async () => {
    try {
      const blob = await getInvoice(order.id).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-OD-${order.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not download the invoice.");
    }
  };

  if (isLoading || isError)
    return (
      <ApiStateHandler
        isLoading={isLoading}
        isError={isError}
        loadingMessage=""
        errorMessage={error}
      />
    );

  return (
    <main className="customer-main">
      <div className="customer-wrap">
        <div className="customer-heading order-detail-heading">
          <div>
            <span className="auth-kicker col_1">ORDER DETAILS</span>
            <h1>Your order</h1>
            <p>Everything you need to know about your purchase.</p>
          </div>
          <div className="order-reference">
            <span>ORDER ID</span>
            <strong id="tracked-order-reference">{`#OD-${order.id}`}</strong>
            <small id="tracked-order-date">
              <i className="fa fa-calendar-o"></i>{" "}
              {longDateFormat(order.created_at)}
            </small>
          </div>
        </div>
        <OrderStatusTimeline
          status={order.status}
          statusDisplay={order.status_display}
        />
        <OrderActions order={order} />
        <div className="order-detail-grid">
          <div className="order-detail-main">
            <section className="customer-panel">
              <div className="panel-title-row">
                <div>
                  <span className="section-eyebrow">IN YOUR ORDER</span>
                  <h3>Products</h3>
                </div>
                <span className="item-count">
                  <i className="fa fa-cube"></i> {order.items_count} items
                </span>
              </div>
              <div id="tracked-order-products">
                {order.items.map((product) => (
                  <OrderProductCard key={product.id} item={product} />
                ))}
              </div>
            </section>
            <section className="customer-panel">
              <div className="panel-title-row">
                <div>
                  <span className="section-eyebrow">WHERE IT’S GOING</span>
                  <h3>Shipping address</h3>
                </div>
                <i className="fa fa-map-marker panel-heading-icon"></i>
              </div>
              <div className="order-address">
                <span className="order-address-avatar">AS</span>
                <div>
                  <strong id="tracked-shipping-name">{`${order.first_name} ${order.last_name}`}</strong>
                  <p id="tracked-shipping-details">
                    {order.phone}
                    <br />
                    {street}
                    <br />
                    {region}
                  </p>
                </div>
              </div>
            </section>
          </div>
          <aside className="order-detail-side">
            <OrderPaymentSummary order={order} />
            <PaymentSection order={order} />
          </aside>
        </div>
        <footer className="order-help-footer">
          <div>
            <span className="order-help-icon">
              <i className="fa fa-life-ring"></i>
            </span>
            <span>
              <strong>Need help with this order?</strong>
              <small>Our support team is happy to help.</small>
            </span>
          </div>
          <div className="order-footer-actions">
            <a
              className="order-support-link"
              id="order-support-link"
              href="contact.html?order=OD-982341-2026"
            >
              <i className="fa fa-comments"></i> Contact support
            </a>

            {canDownloadInvoice && (
              <button
                className="order-utility-link print-receipt"
                type="button"
                title="Open print dialog to print or save this invoice as PDF"
                onClick={handleInvoice}
                disabled={isFetching}
              >
                <i className="fa fa-download"></i>
                {isFetching ? "Preparing..." : "Download invoice (PDF)"}
              </button>
            )}
          </div>
        </footer>
        <div className="order-bottom-nav">
          <AnchorButton
            className="button_1 order-back-link"
            href="/account/orders"
          >
            <i className="fa fa-arrow-left"></i> Back to my orders
          </AnchorButton>
          <AnchorButton className="order-buy-again" href="/pizzas">
            <i className="fa fa-repeat"></i> Shop again
          </AnchorButton>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailSection;
