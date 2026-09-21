import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, getMe } from "../services/authService";

const formatUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u.id || u._id,
  };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("user");
      if (!saved) return null;
      try {
        return formatUser(JSON.parse(saved));
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    getMe()
      .then((data) => {
        if (isMounted && data.success && data.user) {
          const formatted = formatUser(data.user);
          setUser(formatted);
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("user", JSON.stringify(formatted));
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const formatted = formatUser(data.user);
    setToken(data.token);
    setUser(formatted);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(formatted));
    }
    return data;
  };

  const logout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    currentUser: user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
