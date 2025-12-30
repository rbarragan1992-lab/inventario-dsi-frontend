import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="container">
      <div className="nav">
        <div>
          <strong>Inventario</strong><br/>
          <small className="muted">{user ? `${user.name} (${user.role})` : ""}</small>
        </div>
        <div className="navlinks">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? "active" : ""}>Productos</NavLink>
          <NavLink to="/movements" className={({isActive}) => isActive ? "active" : ""}>Movimientos</NavLink>
          <button className="secondary" onClick={onLogout} style={{width:"auto"}}>Salir</button>
        </div>
      </div>
      {children}
    </div>
  );
}
