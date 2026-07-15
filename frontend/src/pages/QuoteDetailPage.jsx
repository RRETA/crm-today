import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useConfirm } from "../context/ConfirmContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useOptions } from "../hooks/useOptions.js";

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { options: productOptions } = useOptions("/products/", "name");
  const { notify } = useToast();
  const confirm = useConfirm();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchQuote() {
    setLoading(true);
    try {
      const res = await apiClient.get(`/quotes/${id}/`);
      setQuote(res.data);
    } catch {
      setError("No se pudo cargar la cotización.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddItem(e) {
    e.preventDefault();
    if (!productId) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = { quote: id, product: productId, quantity: Number(quantity) };
      if (unitPrice !== "") payload.unit_price = Number(unitPrice);
      await apiClient.post("/quote-items/", payload);
      setProductId("");
      setQuantity(1);
      setUnitPrice("");
      notify("Producto agregado a la cotización.");
      fetchQuote();
    } catch {
      setError("No se pudo agregar la línea. Revisa los datos.");
      notify("No se pudo agregar la línea.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteItem(itemId) {
    const ok = await confirm("¿Eliminar esta línea de la cotización?", { title: "Eliminar línea" });
    if (!ok) return;
    await apiClient.delete(`/quote-items/${itemId}/`);
    notify("Línea eliminada.");
    fetchQuote();
  }

  if (loading) return <div className="loading">Cargando…</div>;
  if (!quote) return <div className="form-error">{error || "Cotización no encontrada."}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Cotización #{quote.id}</h1>
        <Link className="btn btn-secondary" to="/quotes">
          ← Volver a cotizaciones
        </Link>
      </div>

      <div className="card-grid">
        <div className="card stat-card">
          <div className="stat-label">Estado</div>
          <div className="stat-value" style={{ fontSize: 18 }}>
            <span className="status-pill">{quote.status}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">${Number(quote.total).toLocaleString()}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Líneas de la cotización</h2>
        {quote.items.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Sin productos agregados todavía.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td>{productOptions.find((o) => o.value === item.product)?.label ?? item.product}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.unit_price).toLocaleString()}</td>
                    <td>${Number(item.line_total).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Agregar producto</h2>
        <form onSubmit={handleAddItem} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-field" style={{ minWidth: 200 }}>
            <label>Producto</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              <option value="">Selecciona…</option>
              {productOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field" style={{ width: 100 }}>
            <label>Cantidad</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="form-field" style={{ width: 140 }}>
            <label>Precio unitario (opcional)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Precio del catálogo"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Agregando…" : "Agregar"}
          </button>
        </form>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
}
