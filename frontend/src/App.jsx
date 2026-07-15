import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout.jsx";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import ActivitiesPage from "./pages/ActivitiesPage.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OpportunitiesPage from "./pages/OpportunitiesPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import QuoteDetailPage from "./pages/QuoteDetailPage.jsx";
import QuotesPage from "./pages/QuotesPage.jsx";
import StagesPage from "./pages/StagesPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/stages" element={<StagesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/quotes/:id" element={<QuoteDetailPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
