import { createContext, useCallback, useContext, useRef, useState } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setRequest({
        message,
        title: options.title || "Confirmar acción",
        confirmLabel: options.confirmLabel || "Eliminar",
        cancelLabel: options.cancelLabel || "Cancelar",
        danger: options.danger !== false,
      });
    });
  }, []);

  function handleChoice(result) {
    setRequest(null);
    resolver.current?.(result);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {request && (
        <div className="modal-backdrop" onClick={() => handleChoice(false)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <h2>{request.title}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{request.message}</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => handleChoice(false)}>
                {request.cancelLabel}
              </button>
              <button
                className={request.danger ? "btn btn-danger" : "btn btn-primary"}
                onClick={() => handleChoice(true)}
              >
                {request.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm debe usarse dentro de ConfirmProvider");
  return ctx.confirm;
}
