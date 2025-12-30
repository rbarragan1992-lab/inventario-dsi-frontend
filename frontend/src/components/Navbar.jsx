import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const nav = useNavigate();
  const { logout, token } = useAuth(); // token lo usaremos para mostrar el botón

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* IZQUIERDA */}
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-brand fw-bold">Inventario</span>

          <Link className="nav-link text-light" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link text-light" to="/products">
            Productos
          </Link>
          <Link className="nav-link text-light" to="/movements">
            Reportes
          </Link>
        </div>

        {/* DERECHA */}
        <div className="d-flex align-items-center gap-3 text-light">
          <span className="small">
            UTM-DSI · Barragan Ruben · Lozada Christian ©
          </span>

          {/* Mostrar botón solo si hay sesión */}
          {token && (
            <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
