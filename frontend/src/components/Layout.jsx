import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import {
  IconBox,
  IconBuilding,
  IconCalendar,
  IconDashboard,
  IconFileText,
  IconLayers,
  IconLogout,
  IconTarget,
  IconUser,
  IconUsers,
} from "./icons.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { to: "/accounts", label: "Cuentas", icon: IconBuilding },
  { to: "/contacts", label: "Contactos", icon: IconUser },
  { to: "/opportunities", label: "Oportunidades", icon: IconTarget },
  { to: "/stages", label: "Etapas", icon: IconLayers },
  { to: "/products", label: "Productos", icon: IconBox },
  { to: "/quotes", label: "Cotizaciones", icon: IconFileText },
  { to: "/activities", label: "Actividades", icon: IconCalendar },
];

export function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="sidebar-brand">CRM Portal</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <item.icon className="nav-icon" />
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/users">
              <IconUsers className="nav-icon" />
              Usuarios
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
      </aside>

      {navOpen && <div className="sidebar-backdrop" onClick={() => setNavOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button
            className="hamburger"
            aria-label="Abrir menú"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-user">
            <span className="topbar-username">{user?.username}</span>
            <span className="badge">{user?.role}</span>
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              <IconLogout style={{ marginRight: 6, verticalAlign: -3 }} />
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
