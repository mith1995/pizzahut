import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../../services/api";

import PizzaTabs from "./PizzaTabs";
import FallbackImage from "../../../components/common/FallbackImage";
import RatingStar from "../../../components/common/RatingStar";
import Button from "../../../components/common/Button";
import { useAddToCart } from "../../../hooks/useAddToCart";
import toast from "react-hot-toast";
import ApiStateHandler from "../../../components/common/ApiStateHandler";
import { formatPrice } from "../../../utils/helper";

function PizzaInfo() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const {
    data: product,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProductQuery(slug);
  const { addToCart } = useAddToCart();

  const increaseQty = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const decreaseQty = () => {
    quantity > 1 && setQuantity((quantity) => quantity - 1);
  };

  useEffect(() => {
    const defaultVariant = product?.variants?.find(
      (variant) => variant.is_active,
    );

    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(selectedVariant.id, quantity);
      toast.success("Pizza added to cart", {
        duration: 3000,
        icon: "🍕",
      });
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  if (isLoading || isError) {
    return (
      <ApiStateHandler
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <div className="list_detail_1 clearfix">
        {isFetching && (
          <p className="products-refreshing">Updating products...</p>
        )}
        <div className="col-sm-5">
          <div className="list_detail_1l clearfix">
            <FallbackImage
              src={product.image}
              className="iw"
              height="850"
              alt={product.name}
            />
          </div>
        </div>
        <div className="col-sm-7">
          <div className="list_detail_1r clearfix">
            <h1 className="mgt">{product.name}</h1>
            <h6>
              <RatingStar className="span_1 col_4" rating={product.rating} />
              <span className="span_2">({product.totalRatings} ratings)</span>
            </h6>
            <h3 className="col_1">
              {formatPrice(
                selectedVariant?.price,
                selectedVariant?.currency_symbol,
              )}
            </h3>
            <p>{product.shortDescription}</p>
            <h5>
              Size:
              {product.variants?.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={
                    selectedVariant?.id === variant.id
                      ? "size-option active"
                      : "size-option"
                  }
                >
                  <span
                    className={
                      selectedVariant?.id === variant.id ? "span_1" : "span_2 "
                    }
                  >
                    {variant.size}
                  </span>
                </button>
              ))}
            </h5>
          </div>
          <div className="list_detail_1r1 clearfix">
            <div className="col-sm-12 space_left">
              <div className="list_detail_1r1l clearfix">
                <h4 className="mgt">Ingredients</h4>
                {product.ingredients.map((ingredient, index) => (
                  <h6 key={index}>
                    <i className="fa fa-circle col_1"></i> {ingredient.name}
                  </h6>
                ))}
              </div>
            </div>
          </div>
          <div className="list_detail_1r2 clearfix">
            <h4>Quantity</h4>
            <div className="input-group number-spinner">
              <span className="input-group-btn">
                <Button onClick={decreaseQty}>
                  <span className="glyphicon glyphicon-minus"></span>
                </Button>
              </span>
              <input
                id="qty"
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <span className="input-group-btn">
                <Button onClick={increaseQty}>
                  <span className="glyphicon glyphicon-plus"></span>
                </Button>
              </span>
            </div>
            <div className="cart-button">
              <h6>
                <Button className="button_1 mgt">Check Out</Button>
              </h6>
              <h6>
                <Button className="button" onClick={handleAddToCart}>
                  Add To Bag
                </Button>
              </h6>
            </div>

            <h6 className="bold">
              Categories:{" "}
              <span className="normal">
                <a href="#">{product.category}</a>
              </span>
            </h6>
            <h6 className="bold">
              Tags:
              <span className="normal">
                {product.tags.map((tag, index) => (
                  <React.Fragment key={tag}>
                    <a>{tag}</a>
                    {index < product.tags.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </span>
            </h6>
            <h6 className="bold">
              SKU: <span className="normal">{selectedVariant?.sku}</span>
            </h6>
          </div>
        </div>
      </div>

      <PizzaTabs description={product.description} reviews={product?.reviews} />
    </>
  );
}

export default PizzaInfo;
