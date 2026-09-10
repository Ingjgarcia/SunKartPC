"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { QrCode, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Printer, Users } from "lucide-react";

export default function DigitalPassPage({
  params,
}: {
  params: { tenantSlug: string; token: string };
}) {
  const { t } = useLanguage();
  const [passData, setPassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPass() {
      try {
        const res = await fetch(`/api/passes/${params.token}`);
        const data = await res.json();
        if (data.success) {
          setPassData(data.data);
        } else {
          setError(data.error?.message || t("passNotFoundSubtitle"));
        }
      } catch (err: any) {
        setError(t("passNotFoundSubtitle"));
      } finally {
        setLoading(false);
      }
    }
    loadPass();
  }, [params.token, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">{t("loadingPass")}</p>
        </div>
      </div>
    );
  }

  if (error || !passData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">{t("passNotFoundTitle")}</h2>
          <p className="text-xs text-slate-400 mb-4">{error || t("passNotFoundSubtitle")}</p>
          <a
            href={`/${params.tenantSlug}`}
            className="block py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            {t("backToHomeBtn")}
          </a>
        </div>
      </div>
    );
  }

  const { pass, order, qrDataUrl } = passData;
  const isPaid = order.paymentStatus === "PAID";
  const isUsed = pass.status === "USED";

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full mb-2">
            SunKart Park Punta Cana
          </div>
          <h1 className="text-xl font-black tracking-tight">{t("passTitle")}</h1>
          <p className="text-xs text-orange-100 font-mono mt-1">{pass.passCode}</p>
        </div>

        {/* Status Indicator */}
        <div
          className={`py-2 px-4 text-center text-xs font-bold uppercase tracking-wider ${
            isUsed
              ? "bg-rose-950/80 text-rose-300 border-b border-rose-900/60"
              : isPaid
              ? "bg-emerald-950/80 text-emerald-300 border-b border-emerald-900/60"
              : "bg-amber-950/80 text-amber-300 border-b border-amber-900/60"
          }`}
        >
          {isUsed ? (
            <span>{t("passUsed")}</span>
          ) : isPaid ? (
            <span>{t("passValid")}</span>
          ) : (
            <span>{t("passPending")}</span>
          )}
        </div>

        {/* QR Code Container */}
        <div className="p-6 text-center">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border-4 border-slate-800 mx-auto">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Código QR de Acceso"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
              />
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {t("passInstruction")}
          </p>
        </div>

        {/* Ticket Details */}
        <div className="px-6 pb-6 space-y-4">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{t("orderLabel")}</span>
              <span className="font-bold text-white font-mono">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t("customerLabel")}</span>
              <span className="font-semibold text-white">
                {order.customer.firstName} {order.customer.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t("totalLabel")}</span>
              <span className="font-bold text-orange-400 font-mono">
                {formatCurrency(order.total, order.currency)}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white mb-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span>{t("authorizedParticipants")} ({order.participants.length})</span>
            </div>
            <ul className="space-y-1 text-slate-300">
              {order.participants.map((p: any, i: number) => (
                <li key={i} className="flex items-center justify-between py-1 border-b border-slate-900 last:border-0">
                  <span>{p.fullName}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Waiver OK
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t("printPdfBtn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

