import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Signout = () => {
  const navigate = useNavigate();
  const { signout } = useAuth();
  const handleSignout = async () => {
    try {
      await signout();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <button type="button" onClick={handleSignout}>
      Sign Out
    </button>
  );
};

export default Signout;
