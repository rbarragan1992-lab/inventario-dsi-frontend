import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    return res.data;
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
  }

  function logout() {
    setToken("");
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
