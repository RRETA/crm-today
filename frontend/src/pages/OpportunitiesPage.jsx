import { useState } from "react";

import { CrudPage } from "../components/CrudPage.jsx";
import { PipelineBoard } from "../components/PipelineBoard.jsx";
import { useOptions } from "../hooks/useOptions.js";

const TYPE_OPTIONS = [
  { value: "SERVICIO", label: "Servicio" },
  { value: "PRODUCTO", label: "Producto" },
];

const STATUS_OPTIONS = [
  { value: "ABIERTA", label: "Abierta" },
  { value: "GANADA", label: "Ganada" },
  { value: "PERDIDA", label: "Perdida" },
];

function ViewToggle({ view, setView }) {
  return (
    <div className="view-toggle" style={{ margin: 0 }}>
      <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
        Lista
      </button>
      <button type="button" className={view === "board" ? "active" : ""} onClick={() => setView("board")}>
        Tablero
      </button>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [view, setView] = useState("list");
  const { options: accountOptions } = useOptions("/accounts/", "name");
  const { options: contactOptions } = useOptions("/contacts/", "name");
  const { options: stageOptions } = useOptions("/stages/", "name");
  const { options: userOptions } = useOptions("/users/", "username");

  const headerLeft = (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <h1 style={{ margin: 0 }}>Oportunidades</h1>
      <ViewToggle view={view} setView={setView} />
    </div>
  );

  if (view === "board") {
    return (
      <div>
        <div className="page-header">{headerLeft}</div>
        <PipelineBoard />
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Nombre", required: true },
    { name: "type", label: "Tipo", type: "select", options: TYPE_OPTIONS, required: true },
    { name: "account", label: "Cuenta", type: "select", options: accountOptions, required: true },
    { name: "contact", label: "Contacto", type: "select", options: contactOptions },
    { name: "stage", label: "Etapa", type: "select", options: stageOptions, required: true },
    { name: "owner", label: "Propietario", type: "select", options: userOptions, required: true },
    { name: "amount", label: "Monto", type: "number", step: "0.01", default: 0 },
    { name: "currency", label: "Moneda", default: "MXN" },
    { name: "probability", label: "Probabilidad (%)", type: "number", default: 0 },
    { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS, default: "ABIERTA" },
  ];

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "type", label: "Tipo" },
    {
      key: "account",
      label: "Cuenta",
      render: (item) => accountOptions.find((o) => o.value === item.account)?.label ?? item.account,
    },
    {
      key: "stage",
      label: "Etapa",
      render: (item) => stageOptions.find((o) => o.value === item.stage)?.label ?? item.stage,
    },
    { key: "amount", label: "Monto", render: (item) => `$${Number(item.amount).toLocaleString()} ${item.currency}` },
    {
      key: "status",
      label: "Estado",
      render: (item) => <span className="status-pill">{item.status}</span>,
    },
  ];

  const filters = [
    { name: "stage", label: "Todas las etapas", options: stageOptions },
    { name: "status", label: "Todos los estados", options: STATUS_OPTIONS },
    { name: "type", label: "Todos los tipos", options: TYPE_OPTIONS },
  ];

  return (
    <CrudPage
      title="Oportunidades"
      headerLeft={headerLeft}
      endpoint="/opportunities/"
      columns={columns}
      fields={fields}
      searchable
      filters={filters}
    />
  );
}
