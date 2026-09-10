"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  RefreshCw,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function StaffScannerPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "IDLE" | "SUCCESS" | "ALREADY_USED" | "UNPAID" | "NOT_FOUND";
    message: string;
    order?: any;
  }>({
    status: "IDLE",
    message: "Listo para escanear código QR de visitante.",
  });

  // Recent demo tokens for 1-click test validation
  const [sampleTokens, setSampleTokens] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const tokens = d.data.filter((o: any) => o.pass).map((o: any) => ({
            orderNumber: o.orderNumber,
            token: o.pass.securityToken,
            status: o.paymentStatus,
            customer: `${o.customer.firstName} ${o.customer.lastName}`,
          }));
          setSampleTokens(tokens);
        }
      });
  }, []);

  const handleValidateToken = async (tokenToTest?: string) => {
    const token = tokenToTest || tokenInput.trim();
    if (!token) return;

    setIsScanning(true);

    try {
      const res = await fetch(`/api/passes/${token}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffName: "Marcos Santana (Staff Pista)" }),
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data.data);
      } else {
        setScanResult({
          status: "NOT_FOUND",
          message: data.error?.message || "Token no encontrado.",
        });
      }
    } catch {
      setScanResult({
        status: "NOT_FOUND",
        message: "Error de red al verificar el pase.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setTokenInput("");
    setScanResult({
      status: "IDLE",
      message: "Listo para escanear código QR de visitante.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Control de Acceso Staff</h1>
              <span className="text-xs text-slate-400">Operador: Marcos Santana • Pista 1</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Big Status Display Screen */}
        <div
          className={`p-8 rounded-3xl border-2 transition-all text-center relative overflow-hidden shadow-2xl ${
            scanResult.status === "SUCCESS"
              ? "bg-emerald-950/90 border-emerald-500 text-white shadow-emerald-900/30"
              : scanResult.status === "ALREADY_USED"
              ? "bg-rose-950/90 border-rose-500 text-white shadow-rose-900/30"
              : scanResult.status === "UNPAID"
              ? "bg-amber-950/90 border-amber-500 text-white shadow-amber-900/30"
              : "bg-slate-900/80 border-slate-800 text-slate-300"
          }`}
        >
          {/* Status Icon */}
          <div className="mb-4">
            {scanResult.status === "SUCCESS" && (
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-400 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            )}
            {scanResult.status === "ALREADY_USED" && (
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border-2 border-rose-400">
                <XCircle className="w-12 h-12" />
              </div>
            )}
            {scanResult.status === "UNPAID" && (
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border-2 border-amber-400">
                <AlertTriangle className="w-12 h-12" />
              </div>
            )}
            {scanResult.status === "IDLE" && (
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border-2 border-slate-700">
                <QrCode className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Status Headline */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {scanResult.status === "SUCCESS" && "✅ PASE VÁLIDO — ADMITIR"}
            {scanResult.status === "ALREADY_USED" && "⛔ PASE YA UTILIZADO"}
            {scanResult.status === "UNPAID" && "⚠️ PAGO PENDIENTE"}
            {scanResult.status === "NOT_FOUND" && "❌ NO ENCONTRADO"}
            {scanResult.status === "IDLE" && "ESCANEA UN PASE"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto mb-4">
            {scanResult.message}
          </p>

          {/* Verified Order Info */}
          {scanResult.order && (
            <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>Orden: {scanResult.order.orderNumber}</span>
                <span>{scanResult.order.customer.firstName} {scanResult.order.customer.lastName}</span>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 block font-semibold">Participantes Autorizados:</span>
                {scanResult.order.participants?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span>{p.fullName} {p.isMinor ? "(Menor)" : ""}</span>
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Waiver OK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manual Token or Hardware Scanner Input */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Entrada de Escáner (Token QR / Lector 2D)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pegar token de QR o escanear..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleValidateToken()}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => handleValidateToken()}
              disabled={isScanning || !tokenInput}
              className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Validar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 1-Click Simulation Buttons */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              ⚡ Simular Escaneos de Prueba con Órdenes del Sistema:
            </span>

            <div className="space-y-1.5">
              {sampleTokens.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTokenInput(t.token);
                    handleValidateToken(t.token);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-400">{t.orderNumber}</span>
                    <span className="text-slate-400">({t.customer})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.status === "PAID"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {t.status === "PAID" ? "LISTO PARA ACCESO" : "PENDIENTE DE PAGO"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
