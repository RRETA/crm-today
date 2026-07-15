import { Link } from "react-router-dom";

import { CrudPage } from "../components/CrudPage.jsx";
import { useOptions } from "../hooks/useOptions.js";

const STATUS_OPTIONS = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "ENVIADA", label: "Enviada" },
  { value: "ACEPTADA", label: "Aceptada" },
  { value: "RECHAZADA", label: "Rechazada" },
];

export default function QuotesPage() {
  const { options: opportunityOptions } = useOptions("/opportunities/", "name");

  const fields = [
    {
      name: "opportunity",
      label: "Oportunidad",
      type: "select",
      options: opportunityOptions,
      required: true,
      readOnlyOnEdit: true,
    },
    { name: "status", label: "Estado", type: "select", options: STATUS_OPTIONS, default: "BORRADOR" },
  ];

  const columns = [
    { key: "id", label: "Folio", render: (item) => `#${item.id}` },
    {
      key: "opportunity",
      label: "Oportunidad",
      render: (item) =>
        opportunityOptions.find((o) => o.value === item.opportunity)?.label ?? item.opportunity,
    },
    { key: "status", label: "Estado", render: (item) => <span className="status-pill">{item.status}</span> },
    { key: "total", label: "Total", render: (item) => `$${Number(item.total).toLocaleString()}` },
  ];

  const filters = [{ name: "status", label: "Todos los estados", options: STATUS_OPTIONS }];

  return (
    <CrudPage
      title="Cotizaciones"
      endpoint="/quotes/"
      columns={columns}
      fields={fields}
      filters={filters}
      renderRowActions={(item) => (
        <Link className="btn btn-secondary btn-sm" to={`/quotes/${item.id}`}>
          Ver detalle
        </Link>
      )}
    />
  );
}
