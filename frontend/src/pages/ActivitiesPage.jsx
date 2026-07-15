import { CrudPage } from "../components/CrudPage.jsx";
import { useOptions } from "../hooks/useOptions.js";

const TYPE_OPTIONS = [
  { value: "LLAMADA", label: "Llamada" },
  { value: "REUNION", label: "Reunión" },
  { value: "TAREA", label: "Tarea" },
  { value: "EMAIL", label: "Email" },
];

const STATUS_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "COMPLETADA", label: "Completada" },
  { value: "CANCELADA", label: "Cancelada" },
];

function toLocalInputValue(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export default function ActivitiesPage() {
  const { options: accountOptions } = useOptions("/accounts/", "name");
  const { options: opportunityOptions } = useOptions("/opportunities/", "name");
  const { options: userOptions } = useOptions("/users/", "username");

  const fields = [
    { name: "subject", label: "Asunto", required: true },
    { name: "type", label: "Tipo", type: "select", options: TYPE_OPTIONS, required: true },
    { name: "account", label: "Cuenta", type: "select", options: accountOptions },
    { name: "opportunity", label: "Oportunidad", type: "select", options: opportunityOptions },
    { name: "owner", label: "Propietario", type: "select", options: userOptions, required: true },
    { name: "due_date", label: "Fecha límite", type: "datetime-local", required: true },
    { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS, default: "PENDIENTE" },
  ];

  const fieldsWithFormatting = fields.map((f) =>
    f.name === "due_date" ? { ...f, format: toLocalInputValue } : f
  );

  const columns = [
    { key: "subject", label: "Asunto" },
    { key: "type", label: "Tipo" },
    { key: "due_date", label: "Fecha límite", render: (item) => new Date(item.due_date).toLocaleString() },
    {
      key: "owner",
      label: "Propietario",
      render: (item) => userOptions.find((o) => o.value === item.owner)?.label ?? item.owner,
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => <span className="status-pill">{item.status}</span>,
    },
  ];

  const filters = [
    { name: "type", label: "Todos los tipos", options: TYPE_OPTIONS },
    { name: "status", label: "Todos los estados", options: STATUS_OPTIONS },
  ];

  return (
    <CrudPage
      title="Actividades"
      endpoint="/activities/"
      columns={columns}
      fields={fieldsWithFormatting}
      searchable
      filters={filters}
    />
  );
}
