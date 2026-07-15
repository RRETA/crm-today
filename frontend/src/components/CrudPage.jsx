import { useEffect, useState } from "react";

import { apiClient } from "../api/client";
import { useConfirm } from "../context/ConfirmContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { CrudModal } from "./CrudModal.jsx";
import { TableSkeleton } from "./Skeleton.jsx";

export function CrudPage({
  title,
  headerLeft,
  endpoint,
  columns,
  fields,
  searchable = false,
  filters = [],
  renderRowActions,
}) {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [listError, setListError] = useState("");
  const { notify } = useToast();
  const confirm = useConfirm();

  const pageSize = 25;

  async function fetchList() {
    setLoading(true);
    setListError("");
    try {
      const params = { page };
      if (search) params.search = search;
      for (const [key, value] of Object.entries(filterValues)) {
        if (value) params[key] = value;
      }
      const res = await apiClient.get(endpoint, { params });
      setItems(res.data.results ?? res.data);
      setCount(res.data.count ?? (res.data.results ?? res.data).length);
    } catch {
      setListError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, page, search, JSON.stringify(filterValues)]);

  function openCreate() {
    setModalItem(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setModalItem(item);
    setShowModal(true);
  }

  async function handleSubmit(payload) {
    if (modalItem) {
      await apiClient.patch(`${endpoint}${modalItem.id}/`, payload);
      notify("Cambios guardados correctamente.");
    } else {
      await apiClient.post(endpoint, payload);
      notify("Registro creado correctamente.");
    }
    setShowModal(false);
    fetchList();
  }

  async function handleDelete(item) {
    const ok = await confirm("Esta acción no se puede deshacer. ¿Deseas continuar?", {
      title: "Eliminar registro",
    });
    if (!ok) return;
    try {
      await apiClient.delete(`${endpoint}${item.id}/`);
      notify("Registro eliminado.");
      fetchList();
    } catch {
      notify("No se pudo eliminar el registro.", { type: "error" });
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div>
      <div className="page-header">
        {headerLeft ?? <h1>{title}</h1>}
        <button className="btn btn-primary" onClick={openCreate}>
          + Nuevo
        </button>
      </div>

      {(searchable || filters.length > 0) && (
        <div className="toolbar">
          {searchable && (
            <input
              placeholder="Buscar…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          )}
          {filters.map((f) => (
            <select
              key={f.name}
              value={filterValues[f.name] || ""}
              onChange={(e) => {
                setPage(1);
                setFilterValues((prev) => ({ ...prev, [f.name]: e.target.value }));
              }}
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {loading ? (
        <TableSkeleton cols={columns.length} />
      ) : listError ? (
        <div className="form-error">{listError}</div>
      ) : items.length === 0 ? (
        <div className="card empty-state">Sin registros todavía.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(item) : item[col.key]}</td>
                  ))}
                  <td>
                    <div className="row-actions">
                      {renderRowActions && renderRowActions(item)}
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <span style={{ alignSelf: "center", fontSize: 13, color: "var(--text-muted)" }}>
            Página {page} de {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}

      {showModal && (
        <CrudModal
          title={modalItem ? `Editar ${title}` : `Nuevo registro — ${title}`}
          fields={fields}
          item={modalItem}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
