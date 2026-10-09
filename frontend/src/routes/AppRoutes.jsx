import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/public/Home/Home";
import About from "../pages/public/About/About";
import ContactUs from "../pages/public/Contact/ContactUs";
import Pizza from "../pages/public/Products/Pizza";
import PizzaDetail from "../pages/public/ProductDetail/PizzaDetail";
import Login from "../pages/auth/Login/Login";
import Registration from "../pages/auth/Register/Registration";
import ForgetPassword from "../pages/auth/ForgotPassword/ForgetPassword";
import VerifyEmailPage from "../pages/auth/VerifyEmail/VerifyEmailPage";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import Dashboard from "../pages/user/Dashboard/Dashboard";
import Profile from "../pages/user/Profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Loader from "../components/common/Loader";
import { Suspense } from "react";
import ChangePassword from "../pages/user/ChangePassword/ChangePassword";
import Cart from "../pages/user/Cart/Cart";
import Checkout from "../pages/user/Checkout/Checkout";
import Order from "../pages/user/Orders/Order";
import OrderDetail from "../pages/user/OrderDetail/OrderDetail";
import Wishlist from "../pages/user/WishlistProduct/Wishlist";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/pizzas" element={<Pizza />} />
          <Route path="/pizzas/:slug" element={<PizzaDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route element={<ProtectedRoute />}>
            <Route index path="/account" element={<Dashboard />} />
            <Route path="/account/profile" element={<Profile />} />
            <Route
              path="/account/change-password"
              element={<ChangePassword />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account/orders" element={<Order />} />
            <Route path="/account/orders/:orderId" element={<OrderDetail />} />
            <Route path="/account/wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
