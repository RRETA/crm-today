import { useState } from "react";

function initialFormState(fields, item) {
  const state = {};
  for (const field of fields) {
    if (field.type === "checkbox") {
      state[field.name] = item ? Boolean(item[field.name]) : Boolean(field.default) || false;
    } else if (item && field.format) {
      state[field.name] = field.format(item[field.name]);
    } else {
      state[field.name] = item ? item[field.name] ?? "" : field.default ?? "";
    }
  }
  return state;
}

export function CrudModal({ title, fields, item, onSubmit, onClose }) {
  const [values, setValues] = useState(() => initialFormState(fields, item));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {};
      for (const field of fields) {
        if (field.readOnlyOnEdit && item) continue;
        let value = values[field.name];
        if (field.type === "number" && value !== "") value = Number(value);
        if ((field.type === "select" || field.fk) && value === "") value = null;
        payload[field.name] = value;
      }
      await onSubmit(payload);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError("Ocurrió un error al guardar.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                  disabled={field.readOnlyOnEdit && !!item}
                >
                  <option value="">{field.placeholder || "Selecciona…"}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                  rows={3}
                />
              ) : field.type === "checkbox" ? (
                <input
                  id={field.name}
                  type="checkbox"
                  checked={!!values[field.name]}
                  onChange={(e) => setField(field.name, e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  step={field.step}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                  disabled={field.readOnlyOnEdit && !!item}
                />
              )}
            </div>
          ))}
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
