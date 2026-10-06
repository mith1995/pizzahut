import LogoutButton from "../auth/LogoutButton";
import AnchorButton from "./AnchorButton";
import { useSelector } from "react-redux";

function AccountDropdown({ isOpen, onToggle }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <li className={`dropdown index-account-menu ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="m_tag index-account-trigger"
        onMouseOver={onToggle}
      >
        <i className="fa fa-user"></i>
      </button>
      {isOpen && (
        <ul className="dropdown-menu drop_3" role="menu">
          {!isAuthenticated ? (
            <>
              <li className="account-guest">
                <AnchorButton href="/login">
                  <i className="fa fa-sign-in"></i> Sign In
                </AnchorButton>
              </li>
              <li className="account-guest">
                <AnchorButton href="/registration" className="border_none">
                  <i className="fa fa-user-plus"></i> Create Account
                </AnchorButton>
              </li>
            </>
          ) : (
            <>
              <li>
                <AnchorButton href="/account">
                  <i class="fa fa-dashboard"></i> Dashboard
                </AnchorButton>
              </li>

              <li>
                <AnchorButton href="/account/profile">
                  <i class="fa fa-pencil"></i> Edit Profile
                </AnchorButton>
              </li>

              <li>
                <AnchorButton href="/account/orders">
                  <i class="fa fa-list"></i> My Orders
                </AnchorButton>
              </li>

              <li>
                <AnchorButton href="/account/wishlist">
                  <i class="fa fa-heart-o"></i> Wishlist
                </AnchorButton>
              </li>

              <li>
                <AnchorButton href="/account/change-password">
                  <i class="fa fa-lock"></i> Change password
                </AnchorButton>
              </li>

              <li>
                <LogoutButton className="customer-nav-logout">
                  <i className="fa fa-sign-out"></i> Sign Out
                </LogoutButton>
              </li>
            </>
          )}
        </ul>
      )}
    </li>
  );
}

export default AccountDropdown;
