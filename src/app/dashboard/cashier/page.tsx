"use client";

import { useState, useEffect } from "react";
import { formatCurrency, convertToDop } from "@/lib/formatters";
import {
  Search,
  CreditCard,
  Banknote,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  QrCode,
  X,
  Lock,
  Unlock,
  FileSpreadsheet,
  AlertTriangle,
  Receipt,
} from "lucide-react";

export default function CashierPOSPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Cashier session state
  const [session, setSession] = useState<{
    id?: string;
    isOpen: boolean;
    openedAt?: string;
    openingFloat: number;
    cashCollected: number;
    cardPosCollected: number;
    ordersProcessed: number;
    expectedCash?: number;
    cashierName?: string;
  }>({
    isOpen: false,
    openingFloat: 100,
    cashCollected: 0,
    cardPosCollected: 0,
    ordersProcessed: 0,
    cashierName: "Valeria Peña",
  });

  // Shift control modals
  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [closeShiftModal, setCloseShiftModal] = useState(false);
  const [xReportModal, setXReportModal] = useState(false);
  const [initialFloatInput, setInitialFloatInput] = useState("100.00");
  const [countedCashInput, setCountedCashInput] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");
  const [lastClosedReport, setLastClosedReport] = useState<any | null>(null);
  const [shiftLoading, setShiftLoading] = useState(false);

  // Payment collection modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"CASHIER_CASH" | "CASHIER_CARD_POS">("CASHIER_CASH");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [cardAuthCode, setCardAuthCode] = useState<string>("");
  const [printReceiptModal, setPrintReceiptModal] = useState(false);

  // Fetch orders
  const loadOrders = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        if (!selectedOrder && data.data.length > 0) {
          setSelectedOrder(data.data[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async () => {
    try {
      const res = await fetch("/api/cashier/session");
      const d = await res.json();
      if (d.success) {
        setSession(d.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadOrders();
    loadSession();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders(searchQuery);
  };

  // Open Shift Handler
  const handleOpenShift = async () => {
    const floatVal = parseFloat(initialFloatInput) || 0;
    setShiftLoading(true);
    try {
      const res = await fetch("/api/cashier/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "OPEN", float: floatVal }),
      });
      const data = await res.json();
      if (data.success) {
        setSession(data.data);
        setOpenShiftModal(false);
        loadOrders(searchQuery);
      } else {
        alert(data.error?.message || "Error al abrir turno de caja.");
      }
    } catch {
      alert("Error de conexión al abrir turno.");
    } finally {
      setShiftLoading(false);
    }
  };

  // Close Shift Handler (Reporte Z)
  const handleCloseShift = async () => {
    if (!countedCashInput && countedCashInput !== "0") {
      alert("Por favor ingresa el monto total de efectivo contado físicamente en la gaveta.");
      return;
    }

    const countedVal = parseFloat(countedCashInput) || 0;
    setShiftLoading(true);
    try {
      const res = await fetch("/api/cashier/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CLOSE",
          sessionId: session.id,
          closingFloat: countedVal,
          notes: shiftNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastClosedReport(data.data);
        setSession((prev) => ({ ...prev, isOpen: false }));
      } else {
        alert(data.error?.message || "Error al cerrar turno de caja.");
      }
    } catch {
      alert("Error de conexión al cerrar turno.");
    } finally {
      setShiftLoading(false);
    }
  };

  // Collect payment
  const handleCollectPayment = async () => {
    if (!selectedOrder) return;
    if (!session.isOpen) {
      alert("El turno de caja está cerrado. Abre la caja primero antes de cobrar.");
      setOpenShiftModal(true);
      return;
    }

    const amount = Number(selectedOrder.total);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: paymentType,
          amount,
          authCode: paymentType === "CASHIER_CARD_POS" ? cardAuthCode : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local order
        setSelectedOrder(data.data);
        // Refresh orders list
        loadOrders(searchQuery);
        // Refresh session
        loadSession();

        setPaymentModalOpen(false);
        setPrintReceiptModal(true);
      } else {
        alert(data.error?.message || "Error al procesar el cobro.");
      }
    } catch {
      alert("Error de conexión al registrar el cobro.");
    }
  };

  // Calculate change for cash
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = selectedOrder ? Math.max(0, tenderedNum - Number(selectedOrder.total)) : 0;

  // Expected cash in drawer
  const expectedCashInDrawer = (session.openingFloat || 0) + (session.cashCollected || 0);
  const countedNum = parseFloat(countedCashInput) || 0;
  const cashDifference = countedNum - expectedCashInDrawer;

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Shift KPIs Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
              POS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Caja Principal #01</span>
                {session.isOpen ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    TURNO ABIERTO
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    TURNO CERRADO
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Cajera: {session.cashierName || "Valeria Peña"} • Fondo Inicial:{" "}
                {formatCurrency(session.openingFloat, "USD")}
              </span>
            </div>
          </div>

          {/* Quick Shift Stats & Control Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Efectivo en Gaveta
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {formatCurrency(expectedCashInDrawer, "USD")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Tarjeta POS
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {formatCurrency(session.cardPosCollected, "USD")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Órdenes Cobradas
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {session.ordersProcessed}
              </span>
            </div>

            {/* Shift Actions */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              {session.isOpen ? (
                <>
                  <button
                    onClick={() => setXReportModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Arqueo (X)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCountedCashInput(String(expectedCashInDrawer));
                      setLastClosedReport(null);
                      setCloseShiftModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold flex items-center gap-1.5 border border-red-500/30 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cerrar Turno (Z)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOpenShiftModal(true)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Abrir Turno de Caja</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Closed shift alert warning */}
        {!session.isOpen && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                La caja se encuentra cerrada. Debes abrir un nuevo turno con el fondo de caja inicial para registrar nuevos cobros en efectivo o tarjeta.
              </span>
            </div>
            <button
              onClick={() => setOpenShiftModal(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex-shrink-0 transition-colors"
            >
              Abrir Turno Ahora
            </button>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por Código de Orden (ej. SK-001001), Nombre del Cliente, Teléfono o Código de Pase..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              loadOrders(e.target.value);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-28 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* 2-Column POS Layout: Left Orders List / Right Selected Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Órdenes Recientes ({orders.length})</span>
              <button
                onClick={() => loadOrders(searchQuery)}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                Actualizar
              </button>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const isPaid = ord.paymentStatus === "PAID";

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-800/90 border-orange-500 shadow-lg shadow-orange-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {isPaid ? "PAGADO" : "PENDIENTE"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-300 font-medium block mt-1">
                          {ord.customer?.firstName} {ord.customer?.lastName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {ord.customer?.phone || ord.customer?.email}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-orange-400 text-sm block">
                          {formatCurrency(ord.total, ord.currency)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ord.items?.length || 1} producto(s)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Order Details (7 cols) */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                      Detalle de Orden POS
                    </span>
                    <h2 className="text-2xl font-black text-white font-mono mt-0.5">
                      {selectedOrder.orderNumber}
                    </h2>
                    <span className="text-xs text-slate-400">
                      Fecha: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.paymentStatus === "PAID"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {selectedOrder.paymentStatus === "PAID" ? "PAGADO / ACTIVO" : "PENDIENTE DE COBRO"}
                    </span>
                    <div className="text-2xl font-black text-white font-mono mt-2">
                      {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ~ {formatCurrency(convertToDop(selectedOrder.total), "DOP")}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Cliente Titular</span>
                    <span className="font-bold text-white text-sm">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Contacto</span>
                    <span className="text-slate-300">
                      {selectedOrder.customer.phone} • {selectedOrder.customer.email}
                    </span>
                  </div>
                </div>

                {/* Participants & Waiver status */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Participantes y Estado de Waiver ({selectedOrder.participants?.length || 0})
                  </h3>
                  <div className="space-y-1.5">
                    {selectedOrder.participants?.map((p: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                      >
                        <span className="font-medium text-white">
                          {p.fullName} {p.isMinor ? "(Menor)" : ""}
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Waiver Firmado
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Actividades Compradas
                  </h3>
                  <div className="space-y-1.5">
                    {selectedOrder.items?.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white block">
                            {item.experienceName || item.experience?.name || "Experiencia"}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            Cantidad: {item.quantity} x {formatCurrency(item.unitPrice, "USD")}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(item.totalPrice, "USD")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-4 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal (Base Imponible)</span>
                    <span className="font-mono text-slate-200">
                      {formatCurrency(selectedOrder.subtotal, "USD")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITBIS (18% Incluido)</span>
                    <span className="font-mono text-slate-200">
                      {formatCurrency(selectedOrder.tax, "USD")}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white text-sm">
                    <span>Balance Total</span>
                    <span className="font-mono text-orange-400">
                      {formatCurrency(selectedOrder.total, "USD")}
                    </span>
                  </div>
                </div>

                {/* POS Action Buttons */}
                <div className="pt-4 flex flex-wrap gap-3">
                  {selectedOrder.paymentStatus !== "PAID" ? (
                    <button
                      onClick={() => {
                        if (!session.isOpen) {
                          alert("El turno de caja está cerrado. Abre la caja primero.");
                          setOpenShiftModal(true);
                          return;
                        }
                        setCashTendered(String(selectedOrder.total));
                        setPaymentModalOpen(true);
                      }}
                      className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <Banknote className="w-5 h-5" />
                      <span>Cobrar Orden (${selectedOrder.total})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setPrintReceiptModal(true)}
                      className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Printer className="w-5 h-5 text-orange-400" />
                      <span>Reimprimir Recibo Térmico (80mm)</span>
                    </button>
                  )}

                  {selectedOrder.pass && (
                    <a
                      href={`/sunkart-pc/pass/${selectedOrder.pass.securityToken}`}
                      target="_blank"
                      className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span>Ver QR</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                Selecciona una orden de la lista para ver el detalle y realizar cobros.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Apertura de Turno */}
        {openShiftModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setOpenShiftModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold">
                <Unlock className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">Apertura de Turno de Caja</h2>
              <p className="text-xs text-slate-400 mb-6">
                Ingresa el fondo de caja inicial con el que arrancas la gaveta de efectivo.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fondo Inicial de Efectivo (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={initialFloatInput}
                      onChange={(e) => setInitialFloatInput(e.target.value)}
                      placeholder="100.00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Equivalente aproximado: ~{" "}
                    {formatCurrency(convertToDop(parseFloat(initialFloatInput) || 0), "DOP")}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Caja:</span>
                    <span className="text-white font-bold">Caja Principal #01</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cajera Asignada:</span>
                    <span className="text-white font-bold">{session.cashierName || "Valeria Peña"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora de Apertura:</span>
                    <span className="text-emerald-400 font-mono">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={shiftLoading}
                  onClick={handleOpenShift}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{shiftLoading ? "Abriendo Turno..." : "Confirmar Apertura de Caja"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Arqueo Parcial (Reporte X) */}
        {xReportModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setXReportModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white no-print"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-white mb-4 no-print text-center">
                Arqueo Parcial de Caja (Corte X)
              </h2>

              {/* Thermal ticket preview */}
              <div className="thermal-receipt bg-white text-black p-4 rounded-lg font-mono text-xs shadow-inner">
                <div className="text-center pb-2 border-b border-dashed border-black">
                  <div className="font-bold text-sm">SUNKART PARK PUNTA CANA</div>
                  <div>CORTE PARCIAL — REPORTE X</div>
                  <div>Blvd. Turístico del Este Km 14</div>
                  <div>Tel: (809) 555-KART</div>
                </div>

                <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
                  <div>CAJA: Principal #01</div>
                  <div>CAJERA: {session.cashierName || "Valeria Peña"}</div>
                  <div>APERTURA: {session.openedAt ? new Date(session.openedAt).toLocaleString() : new Date().toLocaleString()}</div>
                  <div>IMPRESO: {new Date().toLocaleString()}</div>
                </div>

                <div className="py-2 border-b border-dashed border-black space-y-1">
                  <div className="flex justify-between">
                    <span>FONDO INICIAL:</span>
                    <span>{formatCurrency(session.openingFloat, "USD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VENTAS EFECTIVO:</span>
                    <span>{formatCurrency(session.cashCollected, "USD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VENTAS TARJETA POS:</span>
                    <span>{formatCurrency(session.cardPosCollected, "USD")}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-dotted border-black">
                    <span>TOTAL FACTURADO:</span>
                    <span>{formatCurrency(session.cashCollected + session.cardPosCollected, "USD")}</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] font-bold">
                  <div>EFECTIVO ESPERADO EN GAVETA:</div>
                  <div className="text-base font-black mt-0.5">
                    {formatCurrency(expectedCashInDrawer, "USD")}
                  </div>
                  <div className="text-[9px] font-normal mt-2 text-slate-600">
                    *** REPORTE INFORMATIVO — TURNO CONTINÚA ABIERTO ***
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Corte X</span>
                </button>
                <button
                  onClick={() => setXReportModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Cierre de Turno y Arqueo Ciego (Reporte Z) */}
        {closeShiftModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setCloseShiftModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white no-print"
              >
                <X className="w-5 h-5" />
              </button>

              {!lastClosedReport ? (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 font-bold">
                    <Lock className="w-6 h-6" />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1">Cierre de Turno y Arqueo (Corte Z)</h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Cuenta el efectivo real de tu gaveta física para realizar el cuadre contable.
                  </p>

                  <div className="space-y-4">
                    {/* Shift summary metrics */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Fondo Inicial</span>
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(session.openingFloat, "USD")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Ventas Efectivo</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {formatCurrency(session.cashCollected, "USD")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Ventas Tarjeta POS</span>
                        <span className="font-mono font-bold text-cyan-400">
                          {formatCurrency(session.cardPosCollected, "USD")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Órdenes Atendidas</span>
                        <span className="font-mono font-bold text-white">
                          {session.ordersProcessed}
                        </span>
                      </div>
                    </div>

                    {/* Calculated Expected Cash */}
                    <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-orange-300 font-bold block">
                          Efectivo Teórico Esperado
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Fondo Inicial + Efectivo Recaudado
                        </span>
                      </div>
                      <span className="text-xl font-mono font-black text-orange-400">
                        {formatCurrency(expectedCashInDrawer, "USD")}
                      </span>
                    </div>

                    {/* Counted Cash Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Efectivo Real Contado en Gaveta (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-500 font-mono text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={countedCashInput}
                          onChange={(e) => setCountedCashInput(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Live difference alert */}
                    {countedCashInput !== "" && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-bold ${
                          cashDifference === 0
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : cashDifference > 0
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}
                      >
                        <span>
                          {cashDifference === 0
                            ? "✅ Cuadre de Caja Exacto"
                            : cashDifference > 0
                            ? "🟢 Sobrante de Caja:"
                            : "🔴 Faltante de Caja:"}
                        </span>
                        <span className="font-mono text-sm">
                          {cashDifference > 0 ? "+" : ""}
                          {formatCurrency(cashDifference, "USD")}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Observaciones / Notas de Cierre (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={shiftNotes}
                        onChange={(e) => setShiftNotes(e.target.value)}
                        placeholder="Ej. Cierre de turno tarde sin novedades..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={shiftLoading}
                      onClick={handleCloseShift}
                      className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{shiftLoading ? "Procesando Cierre..." : "Confirmar Cierre de Turno y Generar Reporte Z"}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Reporte Z Closed Ticket View */
                <div>
                  <h2 className="text-base font-bold text-white mb-4 no-print text-center">
                    Cierre Exitoso — Reporte Z (Formato 80mm)
                  </h2>

                  <div className="thermal-receipt bg-white text-black p-4 rounded-lg font-mono text-xs shadow-inner">
                    <div className="text-center pb-2 border-b border-dashed border-black">
                      <div className="font-bold text-sm">SUNKART PARK PUNTA CANA</div>
                      <div>CIERRE FISCAL — REPORTE Z</div>
                      <div>Blvd. Turístico del Este Km 14</div>
                      <div>Tel: (809) 555-KART</div>
                    </div>

                    <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
                      <div>SESIÓN ID: {lastClosedReport.id?.substring(0, 8)}</div>
                      <div>CAJA: Principal #01</div>
                      <div>CAJERA: {lastClosedReport.cashierName}</div>
                      <div>APERTURA: {new Date(lastClosedReport.openedAt).toLocaleString()}</div>
                      <div>CIERRE: {new Date(lastClosedReport.closedAt).toLocaleString()}</div>
                    </div>

                    <div className="py-2 border-b border-dashed border-black space-y-1">
                      <div className="flex justify-between">
                        <span>FONDO INICIAL:</span>
                        <span>{formatCurrency(lastClosedReport.openingFloat, "USD")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VENTAS EFECTIVO:</span>
                        <span>{formatCurrency(lastClosedReport.cashCollected, "USD")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VENTAS TARJETA POS:</span>
                        <span>{formatCurrency(lastClosedReport.cardPosCollected, "USD")}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-1 border-t border-dotted border-black">
                        <span>TOTAL FACTURADO:</span>
                        <span>
                          {formatCurrency(lastClosedReport.cashCollected + lastClosedReport.cardPosCollected, "USD")}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-700">
                        <span>ÓRDENES PROCESADAS:</span>
                        <span>{lastClosedReport.ordersProcessed}</span>
                      </div>
                    </div>

                    <div className="py-2 border-b border-dashed border-black space-y-1">
                      <div className="flex justify-between">
                        <span>EFECTIVO TEÓRICO:</span>
                        <span>{formatCurrency(lastClosedReport.expectedCash, "USD")}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>EFECTIVO DECLARADO:</span>
                        <span>{formatCurrency(lastClosedReport.closingFloat, "USD")}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm pt-1 border-t border-dotted border-black">
                        <span>DIFERENCIA:</span>
                        <span>
                          {lastClosedReport.difference >= 0 ? "+" : ""}
                          {formatCurrency(lastClosedReport.difference, "USD")}
                        </span>
                      </div>
                    </div>

                    {lastClosedReport.notes && (
                      <div className="py-1 text-[10px] border-b border-dashed border-black">
                        <span>NOTAS: {lastClosedReport.notes}</span>
                      </div>
                    )}

                    <div className="pt-2 text-center text-[10px]">
                      <div>FIRMA CAJERA: ________________________</div>
                      <div className="mt-2">*** TURNO OFICIALMENTE CERRADO ***</div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 no-print">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir Reporte Z</span>
                    </button>
                    <button
                      onClick={() => setCloseShiftModal(false)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      Finalizar y Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Collection Modal */}
        {paymentModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">Cobro de Orden POS</h2>
              <p className="text-xs text-slate-400 mb-6">
                Orden: {selectedOrder.orderNumber} • Total: {formatCurrency(selectedOrder.total, "USD")}
              </p>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentType("CASHIER_CASH")}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    paymentType === "CASHIER_CASH"
                      ? "bg-orange-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Efectivo (Cash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("CASHIER_CARD_POS")}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    paymentType === "CASHIER_CARD_POS"
                      ? "bg-orange-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tarjeta Física (POS)</span>
                </button>
              </div>

              {/* Cash collection input */}
              {paymentType === "CASHIER_CASH" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Monto Recibido en Efectivo (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Change calculation */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Orden:</span>
                      <span className="font-mono text-white">{formatCurrency(selectedOrder.total, "USD")}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Efectivo Recibido:</span>
                      <span className="font-mono text-white">{formatCurrency(tenderedNum, "USD")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-400 pt-2 border-t border-slate-800 text-sm">
                      <span>Cambio / Devuelta:</span>
                      <span className="font-mono text-base">{formatCurrency(changeDue, "USD")}</span>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-mono">
                      ~ {formatCurrency(convertToDop(changeDue), "DOP")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div>1. Inserta o aproxima la tarjeta física en el verifone/terminal POS.</div>
                    <div>2. Espera el voucher de aprobación del banco.</div>
                    <div>3. Digita el número de autorización para auditoría.</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Número de Autorización / Voucher POS
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. AUTH-994821"
                      value={cardAuthCode}
                      onChange={(e) => setCardAuthCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Confirm button */}
              <button
                type="button"
                onClick={handleCollectPayment}
                className="w-full mt-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar Pago y Activar Pase</span>
              </button>
            </div>
          </div>
        )}

        {/* 80mm Thermal Receipt Modal & Print Preview */}
        {printReceiptModal && selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setPrintReceiptModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white no-print"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-white mb-4 no-print text-center">
                Comprobante de Caja (Formato 80mm)
              </h2>

              {/* Receipt paper preview */}
              <div className="thermal-receipt bg-white text-black p-4 rounded-lg font-mono text-xs shadow-inner">
                <div className="text-center pb-2 border-b border-dashed border-black">
                  <div className="font-bold text-sm">SUNKART PARK PUNTA CANA</div>
                  <div>RNC: 131-99887-1</div>
                  <div>Blvd. Turístico del Este Km 14</div>
                  <div>Tel: (809) 555-KART</div>
                </div>

                <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
                  <div>ORDEN: {selectedOrder.orderNumber}</div>
                  <div>FECHA: {new Date().toLocaleString()}</div>
                  <div>CAJERA: {session.cashierName || "Valeria Peña"}</div>
                  <div>
                    CLIENTE: {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </div>
                </div>

                <div className="py-2 border-b border-dashed border-black">
                  <div className="font-bold mb-1">ACTIVIDADES:</div>
                  {selectedOrder.items?.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {it.quantity}x {it.experienceName || it.experience?.name || "Experiencia"}
                      </span>
                      <span>${it.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="py-2 border-b border-dashed border-black space-y-0.5">
                  <div className="flex justify-between">
                    <span>SUBTOTAL (Base):</span>
                    <span>${selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITBIS (18% Incluido):</span>
                    <span>${selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1">
                    <span>TOTAL:</span>
                    <span>${selectedOrder.total} USD</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px]">
                  <div className="font-bold">PASE DE ACCESO: {selectedOrder.pass?.passCode}</div>
                  <div className="mt-1">*** WAIVER DIGITAL VERIFICADO ***</div>
                  <div className="mt-2">¡Gracias por su visita!</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex gap-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ticket</span>
                </button>
                <button
                  onClick={() => setPrintReceiptModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
