"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { demoStore, DemoExperience } from "@/lib/demo-store";
import { formatCurrency, convertToDop, calculateOrderTotals } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Users, Calendar, ArrowRight, User, Mail, Phone, Sparkles, CheckCircle2 } from "lucide-react";

export default function BookingPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const selectedExpId = searchParams.get("exp") || demoStore.experiences[0].id;

  const [experience, setExperience] = useState<DemoExperience | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);

  // Customer primary contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Participants list
  const [participants, setParticipants] = useState<
    { fullName: string; dob: string; isMinor: boolean }[]
  >([]);

  useEffect(() => {
    const exp = demoStore.experiences.find((e) => e.id === selectedExpId) || demoStore.experiences[0];
    setExperience(exp);
    const count = (exp.participantsCount || 1) * quantity;
    setParticipants(Array.from({ length: count }, () => ({ fullName: "", dob: "", isMinor: false })));
  }, [selectedExpId]);

  const handleSelectExperience = (exp: DemoExperience) => {
    setExperience(exp);
    const count = (exp.participantsCount || 1) * quantity;
    setParticipants((prev) => {
      const next = [];
      for (let i = 0; i < count; i++) {
        next.push(prev[i] || { fullName: "", dob: "", isMinor: false });
      }
      return next;
    });
  };

  // Update participant list size when quantity changes
  const handleQuantityChange = (newQty: number) => {
    const qty = Math.max(1, Math.min(10, newQty));
    setQuantity(qty);
    const count = (experience?.participantsCount || 1) * qty;

    setParticipants((prev) => {
      const next = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          next.push({ fullName: "", dob: "", isMinor: false });
        }
      } else {
        next.splice(count);
      }
      return next;
    });
  };

  const handleParticipantChange = (index: number, field: string, value: any) => {
    setParticipants((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === "dob" && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        item.isMinor = age < 18;
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone) {
      alert(t("alertFillPrimaryContact"));
      return;
    }

    for (let i = 0; i < participants.length; i++) {
      if (!participants[i].fullName || !participants[i].dob) {
        alert(`${t("alertFillParticipant")}${i + 1}.`);
        return;
      }
    }

    // Save temporary booking draft in localStorage
    const bookingDraft = {
      experience,
      quantity,
      bookingDate,
      customer: { firstName, lastName, email, phone },
      participants,
    };
    localStorage.setItem("adventureos_booking_draft", JSON.stringify(bookingDraft));

    // Redirect to Waiver
    router.push(`/${params.tenantSlug}/waiver`);
  };

  if (!experience) return null;

  const unitPrice = experience.price;
  const { subtotal, tax, total } = calculateOrderTotals({ unitPrice, quantity });
  const totalParticipants = participants.length;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="text-orange-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">1</span>
              {t("stepParticipants")}
            </span>
            <span className="text-slate-600">———</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">2</span>
              {t("stepWaiver")}
            </span>
            <span className="text-slate-600">———</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">3</span>
              {t("stepCheckout")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Choose your experience */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {t("chooseExperienceTitle")}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {t("chooseExperienceSubtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {demoStore.experiences.map((exp) => {
                    const isSelected = experience.id === exp.id;
                    return (
                      <div
                        key={exp.id}
                        onClick={() => handleSelectExperience(exp)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                          isSelected
                            ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/15 ring-2 ring-orange-500/20"
                            : "border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-950"
                        }`}
                      >
                        <div>
                          <h3 className="font-bold text-white text-sm tracking-tight">{exp.name}</h3>
                          <div className="text-2xl font-black text-orange-500 font-mono my-1.5">
                            {formatCurrency(exp.price, "USD")}
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800/90 text-[11px] font-medium text-slate-300 w-fit mb-3">
                            {exp.participantsCount} {exp.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span>{exp.category}</span>
                          {isSelected && <span className="text-orange-400 font-bold text-xs">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visit Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    {t("visitDate")}
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full h-12 bg-slate-950 border border-slate-700 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>



              {/* Customer Contact */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-orange-400" />
                  {t("customerContactTitle")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">{t("firstName")}</label>
                    <input
                      type="text"
                      placeholder="Ej. Juan"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (!participants[0].fullName) {
                          handleParticipantChange(0, "fullName", `${e.target.value} ${lastName}`.trim());
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">{t("lastName")}</label>
                    <input
                      type="text"
                      placeholder="Ej. Pérez"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        handleParticipantChange(0, "fullName", `${firstName} ${e.target.value}`.trim());
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">{t("email")}</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">{t("phone")}</label>
                    <input
                      type="tel"
                      placeholder="+1 (809) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Participants Roster */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  {t("participantsRosterTitle")} ({participants.length})
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  {t("participantsRosterSubtitle")}
                </p>


                <div className="space-y-4">
                  {participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/30">
                        #{idx + 1}
                      </span>
                      <div className="flex-1 w-full sm:w-auto">
                        <label className="block text-[11px] text-slate-400 mb-1">{t("fullName")}</label>
                        <input
                          type="text"
                          placeholder="Nombre y Apellido"
                          value={p.fullName}
                          onChange={(e) => handleParticipantChange(idx, "fullName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <label className="block text-[11px] text-slate-400 mb-1">{t("birthDate")}</label>
                        <input
                          type="date"
                          value={p.dob}
                          onChange={(e) => handleParticipantChange(idx, "dob", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      {p.dob && (
                        <div className="sm:pt-5">
                          {p.isMinor ? (
                            <span className="inline-block text-[11px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/30 font-medium">
                              {t("minorLabel")}
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 font-medium">
                              {t("adultLabel")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-white text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>{t("continueToWaiver")}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-white text-base mb-4 border-b border-slate-800 pb-3">
                {t("orderSummary")}
              </h3>

              <div className="flex items-center gap-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 mb-4">
                <img
                  src={experience.imageUrl}
                  alt={experience.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700/80 flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm truncate">{experience.name}</h4>
                  <span className="text-xs text-orange-400 font-medium block">{experience.category}</span>
                  <span className="text-[11px] text-slate-400">
                    {experience.participantsCount} {experience.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{experience.name}</span>
                  <span className="font-mono font-medium">{formatCurrency(unitPrice, "USD")}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>{t("stepParticipants")}</span>
                  <span>{participants.length} {participants.length === 1 ? t("participantBadge") : t("participantsBadge")}</span>
                </div>

                <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800/80">
                  <span>{t("subtotalTaxBase")}</span>
                  <span className="font-mono">{formatCurrency(subtotal, "USD")}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>{t("itbisIncluded")}</span>
                  <span className="font-mono">{formatCurrency(tax, "USD")}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white text-base">{t("totalToPay")}</span>
                  <div className="text-right">
                    <span className="font-black text-orange-400 text-2xl font-mono block">
                      {formatCurrency(total, "USD")}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~ {formatCurrency(convertToDop(total), "DOP")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t("freeCancel")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t("payOnlineOrCashier")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
