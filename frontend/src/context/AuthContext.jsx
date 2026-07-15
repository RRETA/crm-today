import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiClient } from "../api/client";
import { clearTokens, getAccessToken, setTokens } from "../api/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get("/users/me/");
        setUser(res.data);
      } catch {
        clearTokens();
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  async function login(username, password) {
    const res = await apiClient.post("/auth/token/", { username, password });
    setTokens({ access: res.data.access, refresh: res.data.refresh });
    const me = await apiClient.get("/users/me/");
    setUser(me.data);
    return me.data;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "ADMIN",
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
