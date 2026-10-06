import { NavLink, useLocation } from "react-router-dom";

function DropdownMenu({ title, items, isOpen, onToggle }) {
  const location = useLocation();

  const isActive = items.some((item) => item.to === location.pathname);
  return (
    <li className={`dropdown ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className={`m_tag ${isActive ? "active_tab" : ""}`}
        onClick={onToggle}
      >
        {title}
        <span className="caret"></span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu drop_3" role="menu">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={item.className || ""}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default DropdownMenu;
