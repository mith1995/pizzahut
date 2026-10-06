import toast from "react-hot-toast";

export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.message ||
  error?.data?.message ||
  error?.data?.error ||
  error?.data?.detail ||
  fallback;

export const runAction = async (action, { success, fallbackError } = {}) => {
  try {
    const res = await action().unwrap();
    if (success) toast.success(success, { duration: 3000 });
    return { ok: true, res };
  } catch (error) {
    toast.error(getErrorMessage(error, fallbackError));
    return { ok: false, error }; // error return karne se form field errors bhi mil sakte hain (error.errors)
  }
};
