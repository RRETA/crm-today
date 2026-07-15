import { CrudPage } from "../components/CrudPage.jsx";

export default function StagesPage() {
  const fields = [
    { name: "name", label: "Nombre", required: true },
    { name: "order", label: "Orden", type: "number", required: true, default: 0 },
    { name: "is_won", label: "Es etapa ganada", type: "checkbox" },
    { name: "is_lost", label: "Es etapa perdida", type: "checkbox" },
  ];

  const columns = [
    { key: "order", label: "Orden" },
    { key: "name", label: "Nombre" },
    { key: "is_won", label: "Ganada", render: (item) => (item.is_won ? "Sí" : "—") },
    { key: "is_lost", label: "Perdida", render: (item) => (item.is_lost ? "Sí" : "—") },
  ];

  return <CrudPage title="Etapas del pipeline" endpoint="/stages/" columns={columns} fields={fields} />;
}
