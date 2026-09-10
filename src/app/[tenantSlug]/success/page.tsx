"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CheckCircle2, QrCode, ArrowRight, Clock, ShieldCheck, Download, Share2 } from "lucide-react";

export default function SuccessPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "SK-001001";
  const securityToken = searchParams.get("token") || "demo-token";
  const method = searchParams.get("method") || "ONLINE";

  const isPaid = method === "ONLINE";

  useEffect(() => {
    if (isPaid) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isPaid]);

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div
          className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isPaid ? "bg-emerald-500/20" : "bg-amber-500/20"
          }`}
        ></div>

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-xl ${
            isPaid
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10"
              : "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/10"
          }`}
        >
          {isPaid ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-white tracking-tight">
          {isPaid ? t("paidSuccessTitle") : t("cashierSuccessTitle")}
        </h1>

        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          {isPaid
            ? t("paidSuccessSubtitle")
            : t("cashierSuccessSubtitle")}
        </p>

        {/* Order Badge Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono block">
            {t("orderCodeLabel")}
          </span>
          <div className="text-2xl font-black text-orange-400 font-mono tracking-wider mt-0.5">
            {orderNumber}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                isPaid
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isPaid ? t("paidActiveStatus") : t("pendingPaymentStatus")}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 space-y-3">
          <Link
            href={`/${params.tenantSlug}/pass/${securityToken}`}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-5 h-5" />
            <span>{t("viewDigitalPassBtn")}</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <Link
            href={`/${params.tenantSlug}`}
            className="block text-xs text-slate-400 hover:text-white transition-colors pt-2"
          >
            {t("backToCatalogBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}

