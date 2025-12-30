import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    min_stock: 0,
  });

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    const res = await api.get("/products");
    setItems(res.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", sku: "", price: 0, stock: 0, min_stock: 0 });
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function create(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        min_stock: Number(form.min_stock),
      });

      setOk("✅ Producto creado");
      resetForm();
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error creando producto";
      setError("❌ " + msg);
    }
  }

  function startEdit(p) {
    setError("");
    setOk("");
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      sku: p.sku || "",
      price: p.price ?? 0,
      stock: p.stock ?? 0, // se muestra, pero lo ideal es manejar stock por Movimientos
      min_stock: p.min_stock ?? 0,
    });
  }

  async function update(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      // Recomendación: NO editar stock desde aquí (stock se gestiona por Movimientos)
      // Pero si tu backend requiere stock en update, puedes enviarlo también.
      await api.put(`/products/${editingId}`, {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        min_stock: Number(form.min_stock),
        // stock: Number(form.stock), // <-- descomenta si tu backend lo exige
      });

      setOk("✅ Producto actualizado");
      resetForm();
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error actualizando producto";
      setError("❌ " + msg);
    }
  }

  async function remove(id) {
    const yes = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!yes) return;

    setError("");
    setOk("");

    try {
      await api.delete(`/products/${id}`);
      setOk("✅ Producto eliminado");
      // si estabas editando ese mismo, limpia el form
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error eliminando producto";
      setError("❌ " + msg);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const qq = q.toLowerCase();
      return name.includes(qq) || sku.includes(qq);
    });
  }, [items, q]);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="m-0">Productos</h3>
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Buscar por nombre o SKU..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>{editingId ? "Editar producto" : "Nuevo producto"}</h5>

            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}

            <form onSubmit={editingId ? update : create}>
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />

              <label className="form-label mt-2">SKU</label>
              <input
                className="form-control"
                name="sku"
                value={form.sku}
                onChange={onChange}
                required
              />

              <label className="form-label mt-2">Precio</label>
              <input
                className="form-control"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={onChange}
              />

              {/* Recomendación: stock se gestiona por movimientos,
                  pero lo dejamos visible por si el profe lo pide */}
              <label className="form-label mt-2">Stock (se gestiona por movimientos)</label>
              <input
                className="form-control"
                name="stock"
                type="number"
                value={form.stock}
                onChange={onChange}
                disabled
              />

              <label className="form-label mt-2">Stock mínimo</label>
              <input
                className="form-control"
                name="min_stock"
                type="number"
                value={form.min_stock}
                onChange={onChange}
              />

              <button className="btn btn-primary w-100 mt-3">
                {editingId ? "Actualizar" : "Guardar"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setError("");
                    setOk("");
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3">
            <h5>Listado</h5>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>SKU</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Mín</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.sku}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td>{p.min_stock}</td>
                      <td>
                        {p.stock <= p.min_stock ? (
                          <span className="badge bg-danger">Bajo</span>
                        ) : (
                          <span className="badge bg-success">OK</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Sin productos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <small className="text-muted">
              Tip: si un producto está “Bajo”, significa stock ≤ mínimo. El stock
              se actualiza con Entradas/Salidas en Movimientos.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
