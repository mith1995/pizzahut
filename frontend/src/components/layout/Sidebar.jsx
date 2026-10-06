import LogoutButton from "../auth/LogoutButton";
import SidebarMenu from "./SidebarMenu";

function Sidebar() {
  return (
    <aside className="customer-sidebar">
      <h4>MY ACCOUNT</h4>

      <SidebarMenu to="/account" exact>
        Dashboard
      </SidebarMenu>
      <SidebarMenu to="/account/profile">Edit Profile</SidebarMenu>
      <SidebarMenu to="/account/orders">My Orders</SidebarMenu>
      <SidebarMenu to="/account/wishlist">Wishlist</SidebarMenu>
      <SidebarMenu to="/account/change-password">Change Password</SidebarMenu>
      <LogoutButton className="customer-signout-btn">Sign out</LogoutButton>
    </aside>
  );
}

export default Sidebar;
