import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Movements() {
  const [movs, setMovs] = useState([]);
  const [products, setProducts] = useState([]);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    product_id: "",
    type: "OUT",      // OUT = venta/salida, IN = entrada/compra
    quantity: 1,
    note: "Venta",
  });

  async function loadMovs() {
    const res = await api.get("/movements");
    setMovs(res.data);
  }

  async function loadProducts() {
    const res = await api.get("/products");
    setProducts(res.data);
  }

  async function loadAll() {
    await Promise.all([loadMovs(), loadProducts()]);
  }

  useEffect(() => {
    loadAll().catch((err) => {
      setError(err?.response?.data?.message || "No se pudo cargar datos");
    });
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createMovement(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      await api.post("/movements", {
        product_id: Number(form.product_id),
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note,
      });

      setOk("✅ Movimiento registrado. Stock actualizado automáticamente.");
      setForm({ product_id: "", type: "OUT", quantity: 1, note: "Venta" });
      await loadAll();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error registrando movimiento";
      setError("❌ " + msg);
    }
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(movs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movements");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "movimientos.xlsx");
  }

  const productOptions = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      label: `${p.name} (Stock: ${p.stock})`,
    }));
  }, [products]);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="m-0">Reportes / Movimientos</h3>
        <button
          className="btn btn-outline-primary"
          onClick={exportExcel}
          disabled={!movs.length}
        >
          Exportar Excel
        </button>
      </div>

      {/* Mensajes */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {ok && <div className="alert alert-success mt-3">{ok}</div>}

      {/* FORMULARIO DE MOVIMIENTOS */}
      <div className="card p-3 mt-3">
        <h5>Registrar movimiento (Venta / Entrada)</h5>

        <form className="row g-2" onSubmit={createMovement}>
          <div className="col-md-4">
            <label className="form-label">Producto</label>
            <select
              className="form-select"
              name="product_id"
              value={form.product_id}
              onChange={onChange}
              required
            >
              <option value="">-- Selecciona --</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={(e) => {
                const v = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  type: v,
                  note: v === "OUT" ? "Venta" : "Entrada",
                }));
              }}
            >
              <option value="OUT">Salida (Venta)</option>
              <option value="IN">Entrada (Compra)</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Cantidad</label>
            <input
              className="form-control"
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Nota</label>
            <input
              className="form-control"
              name="note"
              value={form.note}
              onChange={onChange}
              placeholder="Ej: Venta factura 001, Daño, Ajuste..."
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary">
              Guardar movimiento
            </button>
          </div>
        </form>

        <small className="text-muted d-block mt-2">
          * Al registrar una <b>Salida</b> el stock baja automáticamente. Si intentas
          vender más de lo disponible, el sistema debe rechazarlo.
        </small>
      </div>

      {/* TABLA / HISTORIAL */}
      <div className="card p-3 mt-3">
        <h5>Historial</h5>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Nota</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movs.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.product_name || m.product_id}</td>
                  <td>{m.type}</td>
                  <td>{m.quantity}</td>
                  <td>{m.note}</td>
                  <td>{m.created_at}</td>
                </tr>
              ))}

              {movs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    Sin movimientos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <small className="text-muted">
        Tip: Usa <b>Salida (Venta)</b> para vender y bajar stock. Usa <b>Entrada</b> para reponer.
      </small>
    </div>
  );
}
