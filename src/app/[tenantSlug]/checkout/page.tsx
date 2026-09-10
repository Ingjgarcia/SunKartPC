"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, convertToDop, calculateOrderTotals } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Check, CreditCard, Banknote, ShieldCheck, ArrowRight, UserCheck, Calendar } from "lucide-react";

export default function CheckoutPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASHIER">("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("adventureos_booking_draft");
    if (!saved) {
      router.push(`/${params.tenantSlug}`);
      return;
    }
    const parsed = JSON.parse(saved);
    if (!parsed.waiver?.hasSignature) {
      router.push(`/${params.tenantSlug}/waiver`);
      return;
    }
    setBookingDraft(parsed);
  }, [params.tenantSlug, router]);

  if (!bookingDraft) return null;

  const unitPrice = bookingDraft.experience.price;
  const quantity = bookingDraft.quantity;
  const { subtotal, tax, total } = calculateOrderTotals({ unitPrice, quantity });
  const totalDop = convertToDop(total);

  const handleCheckout = async () => {
    setIsProcessing(true);

    if (paymentMethod === "ONLINE") {
      // Direct to payment processing page
      router.push(`/${params.tenantSlug}/payment`);
      return;
    }

    // CASHIER PAY LATER: Create pending order and go to success with unpaid voucher
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
          paymentMethod: "CASHIER_CASH",
          subtotal,
          tax,
          total,
          currency: "USD",
          isOnlinePaid: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("adventureos_booking_draft");
        router.push(
          `/${params.tenantSlug}/success?order=${data.data.orderNumber}&token=${data.data.pass?.securityToken}&method=CASHIER`
        );
      } else {
        alert(data.error?.message || "Error al procesar la orden.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      alert("Error al conectar con el servidor.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              {t("stepParticipants")}
            </span>
            <span className="text-emerald-500">———</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              {t("stepWaiver")}
            </span>
            <span className="text-orange-500">———</span>
            <span className="text-orange-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">3</span>
              {t("stepCheckout")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Review */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">{t("checkoutDetailsTitle")}</h2>
              
              <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                <img
                  src={bookingDraft.experience.imageUrl}
                  alt={bookingDraft.experience.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">{bookingDraft.experience.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t("visitDate")}: {bookingDraft.bookingDate}</span>
                    <span>•</span>
                    <span>{quantity} {t("stepParticipants")}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t("waiverVerifiedBadge")}</span>
                  </div>
                </div>
              </div>

              {/* Participants list badge */}
              <div className="mt-4">
                <span className="text-xs text-slate-400 block mb-2">{t("registeredRacers")}</span>
                <div className="flex flex-wrap gap-2">
                  {bookingDraft.participants.map((p: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {p.fullName} {p.isMinor ? `(${t("minorLabel")})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">{t("paymentMethodTitle")}</h2>
              <p className="text-xs text-slate-400 mb-4">
                {t("paymentMethodSubtitle")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Online Payment */}
                <div
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CreditCard className="w-6 h-6 text-orange-400" />
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "ONLINE"
                          ? "border-orange-500 bg-orange-500"
                          : "border-slate-600"
                      }`}
                    >
                      {paymentMethod === "ONLINE" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{t("payOnlineTitle")}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("payOnlineDesc")}
                  </p>
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                    {t("recommendedBadge")}
                  </span>
                </div>

                {/* Cashier Payment */}
                <div
                  onClick={() => setPaymentMethod("CASHIER")}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "CASHIER"
                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Banknote className="w-6 h-6 text-emerald-400" />
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "CASHIER"
                          ? "border-orange-500 bg-orange-500"
                          : "border-slate-600"
                      }`}
                    >
                      {paymentMethod === "CASHIER" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{t("payCashierTitle")}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("payCashierDesc")}
                  </p>
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    {t("cashierBadge")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-white text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{paymentMethod === "ONLINE" ? t("proceedOnlineBtn") : t("proceedCashierBtn")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Summary */}
          <div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-white text-base mb-4 border-b border-slate-800 pb-3">
                {t("financialBreakdown")}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{t("subtotalTaxBase")}</span>
                  <span className="font-mono">{formatCurrency(subtotal, "USD")}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{t("itbisIncluded")}</span>
                  <span className="font-mono">{formatCurrency(tax, "USD")}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white text-base">{t("totalFinal")}</span>
                  <div className="text-right">
                    <span className="font-black text-orange-400 text-2xl font-mono block">
                      {formatCurrency(total, "USD")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ~ {formatCurrency(totalDop, "DOP")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                <p>
                  {t("fiscalReceiptNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
