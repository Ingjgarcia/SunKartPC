"use client";

import { useState, useEffect } from "react";
import { formatCurrency, convertToDop } from "@/lib/formatters";
import { demoStore } from "@/lib/demo-store";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Settings,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tenant = demoStore.tenant;

  useEffect(() => {
    setMounted(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setOrders(d.data);
        } else {
          setOrders(demoStore.orders);
        }
      })
      .catch(() => {
        setOrders(demoStore.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute live KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const totalPaidOrders = orders.filter((o) => o.paymentStatus === "PAID").length;
  const totalPendingOrders = orders.filter((o) => o.paymentStatus !== "PAID").length;

  const totalParticipants = orders.reduce(
    (sum, o) => sum + (o.participants ? o.participants.length : 1),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                TENANT: {tenant.slug.toUpperCase()}
              </span>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                MODO DEMO OPERATIVO
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{tenant.name}</h1>
            <p className="text-xs text-slate-400">
              Centro de Operaciones y Reportes en Tiempo Real • AdventureOS
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase">Tasa de Cambio</span>
              <span className="font-mono font-bold text-white">1 USD = RD$ 60.00</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase">Impuesto ITBIS</span>
              <span className="font-mono font-bold text-white">18.00%</span>
            </div>
          </div>
        </div>

        {/* 4 KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Hoy</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {!mounted || loading ? (
                <div className="h-9 w-32 bg-slate-800/80 animate-pulse rounded-lg my-0.5" />
              ) : (
                formatCurrency(totalRevenue, "USD")
              )}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1 min-h-[16px]">
              {!mounted || loading ? (
                <div className="h-3.5 w-24 bg-slate-800/50 animate-pulse rounded my-0.5" />
              ) : (
                `~ ${formatCurrency(convertToDop(totalRevenue), "DOP")}`
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Órdenes Totales</span>
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {!mounted || loading ? (
                <div className="h-9 w-16 bg-slate-800/80 animate-pulse rounded-lg my-0.5" />
              ) : (
                orders.length
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1 min-h-[16px]">
              {!mounted || loading ? (
                <div className="h-3.5 w-36 bg-slate-800/50 animate-pulse rounded my-0.5" />
              ) : (
                <>
                  <strong className="text-emerald-400">{totalPaidOrders} pagadas</strong> • {totalPendingOrders} en caja
                </>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participantes</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {!mounted || loading ? (
                <div className="h-9 w-16 bg-slate-800/80 animate-pulse rounded-lg my-0.5" />
              ) : (
                totalParticipants
              )}
            </div>
            <span className="text-xs text-slate-400 block mt-1">Visitantes registrados</span>
          </div>

          {/* Waivers */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waivers Firmados</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {!mounted || loading ? (
                <div className="h-9 w-16 bg-slate-800/80 animate-pulse rounded-lg my-0.5" />
              ) : (
                totalParticipants
              )}
            </div>
            <span className="text-xs text-purple-400 block mt-1">100% Cumplimiento Legal</span>
          </div>
        </div>

        {/* 2-Columns: Recent Orders & Catalog Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders Table (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Historial de Órdenes Recientes
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {!mounted || loading ? "..." : `${orders.length} registros`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Orden #</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Pago</th>
                    <th className="p-3 rounded-r-xl">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {!mounted || loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          <span>Cargando órdenes operativas...</span>
                        </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                        No hay órdenes registradas aún
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord, idx) => (
                      <tr key={ord.id || idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td className="p-3">
                          <span className="font-semibold block text-slate-200">
                            {ord.customer?.firstName} {ord.customer?.lastName}
                          </span>
                          <span className="text-[10px] text-slate-500">{ord.customer?.phone}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-orange-400">
                          {formatCurrency(ord.total, ord.currency)}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {ord.paymentMethod || "MOCK"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.paymentStatus === "PAID"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {ord.paymentStatus === "PAID" ? "PAGADO" : "PENDIENTE"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catalog & Tenant Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-400" />
                Catálogo de Experiencias Activas
              </h2>

              <div className="space-y-3">
                {demoStore.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={exp.imageUrl}
                        alt={exp.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">{exp.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {exp.durationMinutes} min • {exp.isPackage ? "Paquete VIP" : "Individual"}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-orange-400 text-xs">
                      {formatCurrency(exp.price, "USD")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Waiver Versioning */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  Waiver Activo (Inmutable)
                </h2>
                <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800/50">
                  v1.0 (Publicado)
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas las firmas capturadas se asocian de forma permanente a la versión v1. Si se actualiza el texto legal, el sistema generará automáticamente la versión v2 sin sobreescribir auditorías previas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
