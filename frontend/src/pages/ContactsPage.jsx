import { CrudPage } from "../components/CrudPage.jsx";
import { useOptions } from "../hooks/useOptions.js";

export default function ContactsPage() {
  const { options: accountOptions } = useOptions("/accounts/", "name");

  const fields = [
    { name: "account", label: "Cuenta", type: "select", options: accountOptions, required: true },
    { name: "name", label: "Nombre", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Teléfono" },
    { name: "position", label: "Puesto" },
  ];

  const columns = [
    { key: "name", label: "Nombre" },
    {
      key: "account",
      label: "Cuenta",
      render: (item) => accountOptions.find((o) => o.value === item.account)?.label ?? item.account,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Teléfono" },
    { key: "position", label: "Puesto" },
  ];

  const filters = [{ name: "account", label: "Todas las cuentas", options: accountOptions }];

  return (
    <CrudPage
      title="Contactos"
      endpoint="/contacts/"
      columns={columns}
      fields={fields}
      searchable
      filters={filters}
    />
  );
}
