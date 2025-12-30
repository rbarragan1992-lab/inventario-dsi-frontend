import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 50 }}>
      <div className="card">
        <h2>Iniciar sesión</h2>
        <p><small className="muted">Demo: admin@demo.com / admin123 (crear con /dev/seed-admin)</small></p>
        {error ? <p style={{ color: "#b00020" }}>{error}</p> : null}
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          <div style={{ height: 10 }} />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div style={{ height: 14 }} />
          <button type="submit">Entrar</button>
        </form>
        <div style={{ height: 12 }} />
        <small className="muted">¿No tienes cuenta? <Link to="/register">Regístrate</Link></small>
      </div>
    </div>
  );
}
