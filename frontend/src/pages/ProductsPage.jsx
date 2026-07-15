import { CrudPage } from "../components/CrudPage.jsx";

const TYPE_OPTIONS = [
  { value: "SERVICIO", label: "Servicio" },
  { value: "PRODUCTO", label: "Producto" },
];

export default function ProductsPage() {
  const fields = [
    { name: "type", label: "Tipo", type: "select", options: TYPE_OPTIONS, required: true },
    { name: "name", label: "Nombre", required: true },
    { name: "sku", label: "SKU", required: true },
    { name: "price", label: "Precio", type: "number", step: "0.01", required: true },
    { name: "stock", label: "Stock (solo productos)", type: "number" },
    { name: "is_active", label: "Activo", type: "checkbox", default: true },
  ];

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "type", label: "Tipo" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Precio", render: (item) => `$${Number(item.price).toLocaleString()}` },
    { key: "stock", label: "Stock", render: (item) => item.stock ?? "—" },
    { key: "is_active", label: "Activo", render: (item) => (item.is_active ? "Sí" : "No") },
  ];

  const filters = [{ name: "type", label: "Todos los tipos", options: TYPE_OPTIONS }];

  return (
    <CrudPage
      title="Catálogo de productos"
      endpoint="/products/"
      columns={columns}
      fields={fields}
      searchable
      filters={filters}
    />
  );
}
