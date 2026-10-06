import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import Button from "../common/Button";

function LogoutButton({ className = "", children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };
  return (
    <Button className={className} type="button" onClick={handleLogout}>
      {children}
    </Button>
  );
}

export default LogoutButton;
