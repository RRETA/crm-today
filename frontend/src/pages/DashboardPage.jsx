import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiClient } from "../api/client";
import { CardSkeleton } from "../components/Skeleton.jsx";
import { IconBuilding, IconClock, IconDollar, IconPercent, IconTarget, IconTrendingUp } from "../components/icons.jsx";

const STATUS_COLORS = { ABIERTA: "#3454d1", GANADA: "#1f9d55", PERDIDA: "#d1344e" };
const QUOTE_COLORS = { BORRADOR: "#94a3b8", ENVIADA: "#e8a13d", ACEPTADA: "#1f9d55", RECHAZADA: "#d1344e" };
const PALETTE = ["#3454d1", "#1f9d55", "#e8a13d", "#7c5cff", "#0fb5c4", "#d1344e"];

function money(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function monthLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card stat-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${accent}1a`,
            color: accent,
          }}
        >
          <Icon width={16} height={16} />
        </div>
        <div className="stat-label" style={{ marginBottom: 0 }}>
          {label}
        </div>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="section-title">{children}</h2>;
}

function ChartCard({ title, children, empty }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 15 }}>{title}</h3>
      {empty ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{empty}</p> : children}
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [byActivityType, setByActivityType] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [topAccounts, setTopAccounts] = useState([]);
  const [ownerPerformance, setOwnerPerformance] = useState([]);
  const [quotesStatus, setQuotesStatus] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [
        kpisRes,
        pipelineRes,
        statusRes,
        activitiesRes,
        trendRes,
        funnelRes,
        topAccountsRes,
        ownerRes,
        quotesRes,
      ] = await Promise.all([
        apiClient.get("/dashboard/kpis/"),
        apiClient.get("/dashboard/pipeline/"),
        apiClient.get("/dashboard/opportunities/"),
        apiClient.get("/dashboard/activities/"),
        apiClient.get("/dashboard/sales-trend/"),
        apiClient.get("/dashboard/funnel/"),
        apiClient.get("/dashboard/top-accounts/"),
        apiClient.get("/dashboard/owner-performance/"),
        apiClient.get("/dashboard/quotes-status/"),
      ]);

      setKpis(kpisRes.data);
      setPipeline(pipelineRes.data.map((r) => ({ name: r.stage__name, monto: Number(r.amount || 0) })));
      setByStatus(
        statusRes.data.map((r) => ({ name: r.status, value: Number(r.amount || 0), count: r.count }))
      );
      setByActivityType(activitiesRes.data.map((r) => ({ name: r.type, cantidad: r.count })));
      setSalesTrend(
        trendRes.data.map((r) => ({
          mes: monthLabel(r.month),
          Abierta: Number(r.abierta || 0),
          Ganada: Number(r.ganada || 0),
          Perdida: Number(r.perdida || 0),
        }))
      );
      setFunnel(
        funnelRes.data.map((r) => ({ name: r.stage__name, cantidad: r.count, monto: Number(r.amount || 0) }))
      );
      setTopAccounts(
        topAccountsRes.data.map((a) => ({ name: a.name, monto: Number(a.total_amount || 0), count: a.opportunity_count }))
      );
      setOwnerPerformance(
        ownerRes.data.map((o) => ({
          name: o.owner__username || "Sin asignar",
          total: Number(o.total_amount || 0),
          ganado: Number(o.won_amount || 0),
        }))
      );
      setQuotesStatus(quotesRes.data.map((q) => ({ name: q.status, value: q.count })));

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} height={70} />
          ))}
        </div>
        <div className="chart-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} height={220} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="card-grid">
        <StatCard icon={IconBuilding} label="Cuentas" value={kpis.accounts_count} accent="#3454d1" />
        <StatCard icon={IconTarget} label="Oportunidades abiertas" value={kpis.open_opportunities_count} accent="#7c5cff" />
        <StatCard icon={IconDollar} label="Pipeline abierto" value={money(kpis.open_pipeline_amount)} accent="#0fb5c4" />
        <StatCard icon={IconPercent} label="Tasa de cierre" value={`${kpis.win_rate}%`} accent="#1f9d55" />
        <StatCard icon={IconTrendingUp} label="Trato promedio ganado" value={money(kpis.avg_deal_size)} accent="#e8a13d" />
        <StatCard icon={IconClock} label="Actividades pendientes" value={kpis.pending_activities_count} accent="#d1344e" />
      </div>

      <SectionTitle>Pipeline y ventas</SectionTitle>
      <div className="chart-grid">
        <ChartCard title="Tendencia de ventas (últimos 6 meses)" empty={salesTrend.length === 0 ? "Sin oportunidades recientes." : null}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => money(value)} />
              <Legend />
              <Area type="monotone" dataKey="Ganada" stackId="1" stroke={STATUS_COLORS.GANADA} fill={STATUS_COLORS.GANADA} fillOpacity={0.7} />
              <Area type="monotone" dataKey="Abierta" stackId="1" stroke={STATUS_COLORS.ABIERTA} fill={STATUS_COLORS.ABIERTA} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Perdida" stackId="1" stroke={STATUS_COLORS.PERDIDA} fill={STATUS_COLORS.PERDIDA} fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Embudo de conversión por etapa" empty={funnel.length === 0 ? "Crea etapas y oportunidades para ver el embudo." : null}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnel} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" fontSize={12} width={90} />
              <Tooltip formatter={(value, key) => (key === "cantidad" ? value : money(value))} />
              <Bar dataKey="cantidad" fill="#3454d1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionTitle>Desempeño</SectionTitle>
      <div className="chart-grid">
        <ChartCard title="Top 5 cuentas por monto" empty={topAccounts.length === 0 ? "Aún no hay oportunidades ligadas a cuentas." : null}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topAccounts} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} tickFormatter={money} />
              <YAxis type="category" dataKey="name" fontSize={12} width={100} />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="monto" fill="#0fb5c4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Desempeño por vendedor" empty={ownerPerformance.length === 0 ? "Sin datos de propietarios todavía." : null}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ownerPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={money} />
              <Tooltip formatter={(value) => money(value)} />
              <Legend />
              <Bar dataKey="total" name="Pipeline total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ganado" name="Ganado" fill={STATUS_COLORS.GANADA} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionTitle>Actividad y cotizaciones</SectionTitle>
      <div className="chart-grid">
        <ChartCard title="Oportunidades por estado" empty={byStatus.length === 0 ? "Sin datos todavía." : null}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byStatus} dataKey="count" nameKey="name" outerRadius={80} innerRadius={40} label>
                {byStatus.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#3454d1"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cotizaciones por estado" empty={quotesStatus.length === 0 ? "Aún no hay cotizaciones." : null}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={quotesStatus} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} label>
                {quotesStatus.map((entry) => (
                  <Cell key={entry.name} fill={QUOTE_COLORS[entry.name] || "#3454d1"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Actividades pendientes por tipo" empty={byActivityType.length === 0 ? "Sin actividades pendientes." : null}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byActivityType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#1f9d55" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
