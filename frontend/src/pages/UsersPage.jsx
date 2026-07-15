import { CrudPage } from "../components/CrudPage.jsx";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "VENDEDOR", label: "Vendedor" },
];

export default function UsersPage() {
  const fields = [
    { name: "username", label: "Usuario", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "first_name", label: "Nombre" },
    { name: "last_name", label: "Apellido" },
    { name: "role", label: "Rol", type: "select", options: ROLE_OPTIONS, default: "VENDEDOR" },
    { name: "is_active", label: "Activo", type: "checkbox", default: true },
    {
      name: "password",
      label: "Contraseña (solo al crear)",
      type: "password",
      required: true,
      readOnlyOnEdit: true,
    },
  ];

  const columns = [
    { key: "username", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rol", render: (item) => <span className="status-pill">{item.role}</span> },
    { key: "is_active", label: "Activo", render: (item) => (item.is_active ? "Sí" : "No") },
  ];

  const filters = [{ name: "role", label: "Todos los roles", options: ROLE_OPTIONS }];

  return (
    <CrudPage
      title="Usuarios del tenant"
      endpoint="/users/"
      columns={columns}
      fields={fields}
      searchable
      filters={filters}
    />
  );
}
