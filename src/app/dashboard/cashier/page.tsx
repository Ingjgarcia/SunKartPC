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
} from "lucide-react";

export default function CashierPOSPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Cashier session state
  const [session, setSession] = useState<{
    isOpen: boolean;
    openingFloat: number;
    cashCollected: number;
    cardPosCollected: number;
    ordersProcessed: number;
  }>({
    isOpen: true,
    openingFloat: 100,
    cashCollected: 0,
    cardPosCollected: 0,
    ordersProcessed: 1,
  });

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

  useEffect(() => {
    loadOrders();
    // Load session
    fetch("/api/cashier/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSession(d.data);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders(searchQuery);
  };

  // Collect payment
  const handleCollectPayment = async () => {
    if (!selectedOrder) return;

    const amount = Number(selectedOrder.total);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: paymentType,
          amount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local order
        setSelectedOrder(data.data);
        // Refresh orders list
        loadOrders(searchQuery);
        // Update session
        setSession((prev) => ({
          ...prev,
          cashCollected: paymentType === "CASHIER_CASH" ? prev.cashCollected + amount : prev.cashCollected,
          cardPosCollected: paymentType === "CASHIER_CARD_POS" ? prev.cardPosCollected + amount : prev.cardPosCollected,
          ordersProcessed: prev.ordersProcessed + 1,
        }));

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

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Shift KPIs Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
              POS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Caja Principal #01</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  TURNO ABIERTO
                </span>
              </div>
              <span className="text-xs text-slate-400">Cajera: Valeria Peña • Fondo Inicial: $100.00</span>
            </div>
          </div>

          {/* Quick Shift Stats */}
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Efectivo en Caja</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {formatCurrency(session.openingFloat + session.cashCollected, "USD")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Cobrado con Tarjeta</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {formatCurrency(session.cardPosCollected, "USD")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Órdenes Procesadas</span>
              <span className="font-mono font-bold text-white text-sm">
                {session.ordersProcessed}
              </span>
            </div>
          </div>
        </div>

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
                      ? "bg-orange-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("CASHIER_CARD_POS")}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    paymentType === "CASHIER_CARD_POS"
                      ? "bg-orange-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tarjeta POS</span>
                </button>
              </div>

              {/* Cash Calculation */}
              {paymentType === "CASHIER_CASH" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      Monto Entregado por el Cliente ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Change Calculation Callout */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Cambio a Devolver:</span>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      {formatCurrency(changeDue, "USD")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
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
                  <div>CAJERA: Valeria Peña</div>
                  <div>
                    CLIENTE: {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </div>
                </div>

                <div className="py-2 border-b border-dashed border-black">
                  <div className="font-bold mb-1">ACTIVIDADES:</div>
                  {selectedOrder.items?.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {it.quantity}x {it.experienceName || "Experiencia"}
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
