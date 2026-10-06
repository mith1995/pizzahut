import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";
import OrderSummary from "./OrderSummary";
import { useGetAddressesQuery } from "../../../services/accountsApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema } from "../../../validations/checkout_schema";
import { usePlaceOrderMutation } from "../../../services/ordersApi";
import toast from "react-hot-toast";
import { runAction } from "../../../utils/apiHelpers";
import {
  useCreatePaymentMutation,
  usePaymentFailedMutation,
  useVerifyPaymentMutation,
} from "../../../services/paymentsApi";
import { useState } from "react";
import { loadRazorpay } from "../../../utils/razorpay";

function CheckoutSection() {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      first_name: "Ramesh",
      last_name: "Pal",
      email: "ramesh@example.com",
      phone: "9632587415",
    },
  });

  const { data: addressData } = useGetAddressesQuery();
  const selectAddress = addressData?.addresses?.find((a) => a.is_default);

  const [placeOrder] = usePlaceOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [paymentFailed] = usePaymentFailedMutation();

  const [orderId, setOrderId] = useState(null); // retry me same order reuse hoga
  const [isPaying, setIsPaying] = useState(false); // click se popup band hone tak

  const openRazorpay = (pay, id) => {
    const rzp = new window.Razorpay({
      key: pay.key_id,
      amount: pay.amount,
      currency: pay.currency,
      order_id: pay.razorpay_order_id,
      name: "Pizza Hut",
      prefill: pay.prefill,
      config: {
        display: {
          blocks: {
            upi: { name: "Pay via UPI", instruments: [{ method: "upi" }] },
            card: { name: "Pay via Card", instruments: [{ method: "card" }] },
          },
          sequence: ["block.upi", "block.card"],
          preferences: { show_default_blocks: false },
        },
      },
      handler: async (response) => {
        // response: razorpay_payment_id, razorpay_order_id, razorpay_signature
        const { ok } = await runAction(() => verifyPayment(response), {
          success: "Payment successful",
        });
        setIsPaying(false);
        if (ok) navigate(`/account/orders/${id}`);
      },
      modal: {
        ondismiss: () => setIsPaying(false), // user ne popup band kiya
      },
    });

    rzp.on("payment.failed", (resp) => {
      const e = resp.error;
      paymentFailed({
        razorpay_order_id: e.metadata.order_id,
        payment_id: e.metadata.payment_id,
        code: e.code,
        description: e.description,
        source: e.source,
        step: e.step,
        reason: e.reason,
      });
      toast.error("Payment failed, please try again");
      setIsPaying(false);
    });

    rzp.open();
  };

  const onPlaceOrder = async (values) => {
    if (isPaying) return;
    if (!selectAddress && !orderId) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsPaying(true);
    try {
      if (!(await loadRazorpay())) {
        toast.error("Payment gateway load nahi hua, internet check karo");
        setIsPaying(false);
        return;
      }

      // 1) Order banao (sirf pehli baar)
      let id = orderId;
      if (!id) {
        const { ok, res } = await runAction(() =>
          placeOrder({ ...values, address_id: selectAddress.id }),
        );
        if (!ok) {
          setIsPaying(false);
          return;
        }

        id = res.id; // FIX 1: pehle res.data.id tha
        setOrderId(id);
      }

      // 2) Razorpay order / payment session
      const { ok: payOk, res: payRes } = await runAction(() =>
        createPayment(id),
      );
      if (!payOk) {
        setIsPaying(false);
        return;
      }

      // 3) Popup kholo
      openRazorpay(payRes, id); // FIX 2: pehle payRes.data tha
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
      setIsPaying(false);
    }
  };

  return (
    <section id="checkout" className="checkout-page">
      <div className="container">
        <div className="checkout-heading">
          <div>
            <p className="checkout-eyebrow">SECURE CHECKOUT</p>
            <h2>Delivery details</h2>
            <p className="checkout-intro">Where should we bring your order?</p>
          </div>
          <a className="checkout-back" href="cart.html">
            <i className="fa fa-angle-left" aria-hidden="true"></i> Back to cart
          </a>
        </div>
        <FormProvider {...methods}>
          <div className="checkout-layout">
            <AddressForm />
            <OrderSummary
              onPlaceOrder={methods.handleSubmit(onPlaceOrder)}
              isPlacing={isPaying}
              hasAddress={!!selectAddress || !!orderId}
              hasOrder={!!orderId}
            />
          </div>
        </FormProvider>
      </div>
    </section>
  );
}

export default CheckoutSection;
