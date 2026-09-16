"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, convertToDop, calculateOrderTotals } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CreditCard, CheckCircle2, XCircle, Banknote, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { BookingStepper } from "@/components/BookingStepper";

export default function PaymentProcessingPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);


  useEffect(() => {
    const saved = localStorage.getItem("adventureos_booking_draft");
    if (!saved) {
      router.push(`/${params.tenantSlug}`);
      return;
    }
    setBookingDraft(JSON.parse(saved));
  }, [params.tenantSlug, router]);

  if (!bookingDraft) return null;

  const unitPrice = bookingDraft.experience.price;
  const quantity = bookingDraft.quantity;
  const { subtotal, tax, total } = calculateOrderTotals({ unitPrice, quantity });

  const handleSimulatePayment = async (status: "APPROVED" | "DECLINED") => {
    setIsProcessing(true);

    if (status === "DECLINED") {
      setTimeout(() => {
        setIsProcessing(false);
        setErrorModal(t("declinedReason"));
      }, 1000);
      return;
    }


    // Success -> Create order in DB / demoStore as PAID
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: bookingDraft.customer,
          items: [
            {
              experienceId: bookingDraft.experience.id,
              quantity,
              unitPrice,
              totalPrice: subtotal,
            },
          ],
          participants: bookingDraft.participants,
          paymentMethod: "ONLINE_CARD",
          subtotal,
          tax,
          total,
          currency: "USD",
          isOnlinePaid: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("adventureos_booking_draft");
        router.push(
          `/${params.tenantSlug}/success?order=${data.data.orderNumber}&token=${data.data.pass?.securityToken}&method=ONLINE`
        );
      } else {
        alert(data.error?.message || "Error al registrar la orden.");
        setIsProcessing(false);
      }
    } catch {
      alert("Error al conectar con la pasarela.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Visual Stepper */}
      <BookingStepper currentStep={4} tenantSlug={params.tenantSlug} />

      <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top decor */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3 shadow-lg shadow-orange-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t("paymentGatewayTitle")}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t("paymentGatewaySubtitle")}
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 text-center">
          <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">
            {t("totalToCharge")}
          </span>
          <div className="text-3xl font-black text-white font-mono">
            {formatCurrency(total, "USD")}
          </div>
          <div className="text-xs text-orange-400 font-mono mt-1">
            ~ {formatCurrency(convertToDop(total), "DOP")} ({t("itbisIncluded")})
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {bookingDraft.experience.name} • {quantity} {t("stepParticipants")}
          </div>
        </div>

        {/* Demo Mode Simulation Actions */}
        <div className="space-y-3">
          <div className="px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-900/50 text-[11px] text-orange-300 text-center font-medium">
            {t("gatewaySimulatorBadge")}
          </div>

          <button
            onClick={() => handleSimulatePayment("APPROVED")}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{t("simulateApprovedBtn")}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSimulatePayment("DECLINED")}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>{t("simulateDeclinedBtn")}</span>
          </button>

          <button
            onClick={() => router.push(`/${params.tenantSlug}/checkout`)}
            disabled={isProcessing}
            className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition-colors"
          >
            {t("backChangePayment")}
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t("pciCertified")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-orange-400" />
            <span>3D-Secure 2.0</span>
          </div>
        </div>

        {/* Error Modal */}
        {errorModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("transactionDeclinedTitle")}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">{errorModal}</p>
              <button
                onClick={() => setErrorModal(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                {t("retryPaymentBtn")}
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

