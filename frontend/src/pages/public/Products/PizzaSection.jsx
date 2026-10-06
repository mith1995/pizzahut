import { useState } from "react";
import { useGetProductsQuery } from "../../../services/api";
import ProductCard from "./ProductCard";
import Pagination from "../../../components/common/Pagination";
import ProductState from "../../../components/common/ProductState";
import ErrorState from "../../../components/common/ErrorState";

function PizzaSection() {
  const [page, setPage] = useState(1);
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetProductsQuery(page);

  if (isLoading) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState
            type="loading"
            title="Loading products"
            message="Please wait while we fetch our delicious pizzas."
          />
        </div>
      </section>
    );
  }

  if (isError) {
    const isConnectionError = !error?.status;

    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ErrorState
            title={
              isConnectionError
                ? "We can't connect to the server"
                : "Unable to load products"
            }
            message={
              isConnectionError
                ? "Please check your connection and try again."
                : "Something went wrong. Please try again in a moment."
            }
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  const pizzas = Array.isArray(products?.results) ? products.results : [];
  const totalPages = Math.ceil(products?.count / 9);

  if (pizzas.length === 0) {
    return (
      <section id="list" className="clearfix">
        <div className="container">
          <ProductState
            type="empty"
            title="No products available"
            message="We couldn't find any pizzas right now. Please check again later."
          />
        </div>
      </section>
    );
  }

  return (
    <section id="list" className="clearfix">
      <div className="container">
        <div className="row">
          {isFetching && (
            <p className="products-refreshing">Updating products...</p>
          )}

          <div className="list_1 mgt clearfix">
            {pizzas.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="pages text-center clearfix">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              next={products?.next}
              previous={products?.previous}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PizzaSection;
