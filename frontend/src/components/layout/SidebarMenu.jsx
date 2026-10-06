import { NavLink } from "react-router-dom";

function SidebarMenu({ to, children, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      {children}
    </NavLink>
  );
}

export default SidebarMenu;
