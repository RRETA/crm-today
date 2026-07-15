import { CrudPage } from "../components/CrudPage.jsx";
import { useOptions } from "../hooks/useOptions.js";

export default function AccountsPage() {
  const { options: userOptions } = useOptions("/users/", "username");

  const fields = [
    { name: "name", label: "Nombre", required: true },
    { name: "rfc", label: "RFC" },
    { name: "industry", label: "Industria" },
    { name: "owner", label: "Propietario", type: "select", options: userOptions, required: true },
  ];

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "rfc", label: "RFC" },
    { key: "industry", label: "Industria" },
    {
      key: "owner",
      label: "Propietario",
      render: (item) => userOptions.find((o) => o.value === item.owner)?.label ?? item.owner,
    },
    { key: "contacts", label: "Contactos", render: (item) => item.contacts?.length ?? 0 },
  ];

  return (
    <CrudPage
      title="Cuentas"
      endpoint="/accounts/"
      columns={columns}
      fields={fields}
      searchable
    />
  );
}
