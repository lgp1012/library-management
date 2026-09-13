import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Signout = ({ iconOnly = false, className = "" }) => {
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

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleSignout}
        title="Đăng xuất"
        className={`p-2 text-sky-300 hover:text-white hover:bg-sky-800/60 rounded-lg transition-colors ${className}`}
      >
        <LogOut className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignout}
      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Đăng xuất</span>
    </button>
  );
};

export default Signout;
