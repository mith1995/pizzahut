import Logo from "./Logo";
import CartDropdown from "../cart/CartDropdown";
import SearchModal from "./SearchModal";
import NavMenu from "./NavMenu";
import { useState } from "react";
import AccountDropdown from "./AccountDropdown";

function Navbar() {
  const [activePopup, setActivePopup] = useState(null);
  return (
    <section id="menu" className="clearfix cd-secondary-nav">
      <nav className="navbar nav_t">
        <div className="container">
          <div className="navbar-header page-scroll">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Logo />
          </div>
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <NavMenu
              activePopup={activePopup}
              setActivePopup={setActivePopup}
            />
            <ul className="nav navbar-nav navbar-right">
              <CartDropdown
                isOpen={activePopup === "cart"}
                onToggle={() =>
                  setActivePopup(activePopup === "cart" ? null : "cart")
                }
              />
              <SearchModal
                isOpen={activePopup === "search"}
                onToggle={() =>
                  setActivePopup(activePopup === "search" ? null : "search")
                }
              />
              <AccountDropdown
                isOpen={activePopup === "account"}
                onToggle={() =>
                  setActivePopup(activePopup === "account" ? null : "account")
                }
              />
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
