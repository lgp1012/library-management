import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.fetchMe();
        setUser(userData.result);
      } catch (error) {
        console.error("Failed to restore session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signin = useCallback(async (formData) => {
    const data = await authService.signin(formData);
    const newToken = data?.result?.token;

    if (!newToken) {
      throw new Error("Không tìm thấy token!");
    }

    localStorage.setItem("token", newToken);

    const userData = await authService.fetchMe();
    setUser(userData.result);
  }, []);

  const signout = useCallback(async () => {
    const currentToken = localStorage.getItem("token");

    try {
      if (currentToken) {
        await authService.signout({ token: currentToken });
      }
    } finally {
      localStorage.clear();
      setUser(null);
    }
  }, []);
  const value = useMemo(
    () => ({ user, signin, signout }),
    [user, signin, signout],
  );

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
