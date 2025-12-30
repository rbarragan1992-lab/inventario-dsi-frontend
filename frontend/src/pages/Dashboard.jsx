import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, lowStock: 0, movements: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const [products, movements] = await Promise.all([
          api.get("/products"),
          api.get("/movements"),
        ]);
        const p = products.data || [];
        const m = movements.data || [];
        const low = p.filter(x => (x.stock ?? 0) <= (x.min_stock ?? 0)).length;
        setStats({ products: p.length, lowStock: low, movements: m.length });
      } catch (e) {
        setError(e?.response?.data?.message || "No se pudo cargar");
      }
    };
    load();
  }, []);

  return (
    <div className="row">
      <div className="card">
        <h3>Resumen</h3>
        {error ? <p style={{ color: "#b00020" }}>{error}</p> : null}
        <p>Total productos: <strong>{stats.products}</strong></p>
        <p>Productos con bajo stock: <strong>{stats.lowStock}</strong></p>
        <p>Movimientos registrados: <strong>{stats.movements}</strong></p>
        <p><small className="muted">Tip: crea el admin con POST /dev/seed-admin y luego agrega categorías/productos.</small></p>
      </div>
      <div className="card">
        <h3>Flujo recomendado</h3>
        <ol>
          <li>Crear admin (backend): <span className="badge">POST /dev/seed-admin</span></li>
          <li>Login como admin</li>
          <li>Crear categorías</li>
          <li>Crear productos</li>
          <li>Registrar entradas/salidas (movimientos)</li>
        </ol>
      </div>
    </div>
  );
}
