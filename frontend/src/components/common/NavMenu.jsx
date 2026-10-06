import { NavLink, useLocation } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";

function NavMenu({ activePopup, setActivePopup }) {
  const location = useLocation();

  // const menuItems = [
  //   { label: "Menu Listing", to: "/list" },
  //   { label: "Menu Detail", to: "/detail", className: "border_none" },
  // ];
  const blogItems = [
    { label: "Blog", to: "/blog" },
    { label: "Blog Detail", to: "/blog_detail", className: "border_none" },
  ];
  const pagesItems = [
    { label: "Register", to: "/register" },
    { label: "Shopping Cart", to: "/cart" },
    { label: "Checkout", to: "/checkout", className: "border_none" },
  ];
  return (
    <ul className="nav navbar-nav">
      <li>
        <NavLink
          className={`m_tag ${location.pathname === "/" ? "active_tab" : ""}`}
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className={`m_tag ${location.pathname === "/about" ? "active_tab" : ""}`}
          to="/about"
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          className={`m_tag ${location.pathname.startsWith("/pizzas") ? "active_tab" : ""}`}
          to="/pizzas"
        >
          Pizzas
        </NavLink>
      </li>
      {/* <DropdownMenu
        title="Menu"
        items={menuItems}
        isOpen={activePopup === "menu"}
        onToggle={() => setActivePopup(activePopup === "menu" ? null : "menu")}
      /> */}
      <DropdownMenu
        title="Blog"
        items={blogItems}
        isOpen={activePopup === "blog"}
        onToggle={() => setActivePopup(activePopup === "blog" ? null : "blog")}
      />
      <li>
        <NavLink
          className={`m_tag ${location.pathname === "/contact" ? "active_tab" : ""}`}
          to="/contact"
        >
          Contact Us
        </NavLink>
      </li>

      <DropdownMenu
        title="Pages"
        items={pagesItems}
        isOpen={activePopup === "pages"}
        onToggle={() =>
          setActivePopup(activePopup === "pages" ? null : "pages")
        }
      />
    </ul>
  );
}

export default NavMenu;
