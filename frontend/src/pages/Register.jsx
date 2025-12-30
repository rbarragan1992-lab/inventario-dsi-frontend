import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");
    try {
      await register(name, email, password);
      setOk("Registro exitoso. Ahora inicia sesión.");
      setTimeout(() => nav("/login"), 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 50 }}>
      <div className="card">
        <h2>Registro</h2>
        {ok ? <p style={{ color: "green" }}>{ok}</p> : null}
        {error ? <p style={{ color: "#b00020" }}>{error}</p> : null}
        <form onSubmit={onSubmit}>
          <label>Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ height: 10 }} />
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <div style={{ height: 10 }} />
          <label>Contraseña (mín. 6)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div style={{ height: 14 }} />
          <button type="submit">Crear cuenta</button>
        </form>
        <div style={{ height: 12 }} />
        <small className="muted">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></small>
      </div>
    </div>
  );
}
