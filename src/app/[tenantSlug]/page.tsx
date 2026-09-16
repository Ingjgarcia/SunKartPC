"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, convertToDop } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Users, Shield, Sparkles, Trophy, CheckCircle2, ArrowRight } from "lucide-react";
import { BookingStepper } from "@/components/BookingStepper";

export default function TenantCatalogPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const { lang, t } = useLanguage();
  const experiences = demoStore.experiences;
  const tenant = demoStore.tenant;

  const [selectedExpId, setSelectedExpId] = useState<string>(experiences[0]?.id || "");
  const selectedExp = experiences.find((e) => e.id === selectedExpId) || experiences[0];

  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    // Check visibility immediately on mount/selection
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      setIsBannerVisible(inView);
    };

    checkVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBannerVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [selectedExpId]);

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      {/* Visual Stepper */}
      <BookingStepper currentStep={1} tenantSlug={params.tenantSlug} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-12 pb-16 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950/0 to-slate-950"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t("heroBadge")}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {t("heroTitlePrefix")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
              {t("heroTitleGradient")}
            </span>{" "}
            {t("heroTitleSuffix")}
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{t("heroFeatureWaiver")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span>{t("heroFeatureKarts")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{t("heroFeatureGroups")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{t("chooseExperienceTitle")}</h2>
            <p className="text-sm text-slate-400 mt-1">{t("step1SelectInstruction")}</p>
          </div>
          <span className="text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-fit">
            Paso 1 de 3: Selección de Experiencia
          </span>
        </div>

        {/* 11 Packages Grid with active selection border */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => {
            const isSelected = selectedExpId === exp.id;

            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpId(exp.id)}
                className={`group relative rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none shadow-lg ${
                  isSelected
                    ? "bg-[#151d2c] border-2 border-orange-500 ring-2 ring-orange-500/30 shadow-orange-500/20 translate-y-[-2px]"
                    : "bg-[#121824] border border-slate-800/90 hover:border-slate-700 hover:bg-[#182030] hover:translate-y-[-1px]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-base sm:text-lg tracking-tight group-hover:text-orange-400 transition-colors">
                      {exp.name}
                    </h3>
                    {isSelected && (
                      <span className="flex-shrink-0 text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        OK
                      </span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-orange-500 font-mono my-3 tracking-tight">
                    {formatCurrency(exp.price, "USD")}
                  </div>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-medium w-fit mb-4">
                    {exp.participantsCount} {exp.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{exp.category}</span>
                  <span className={`font-bold transition-colors ${isSelected ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {isSelected ? "Seleccionado ✓" : "Hacer clic para elegir"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Package Action Banner */}
        {selectedExp && (
          <div
            ref={bannerRef}
            className="mt-8 bg-gradient-to-r from-slate-900 via-slate-900 to-[#141b29] border-2 border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-500/10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <img
                src={selectedExp.imageUrl}
                alt={selectedExp.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-orange-500/40 shadow-lg flex-shrink-0"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t("selectedPackageHeader")}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedExp.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="text-orange-400 font-medium">{selectedExp.category}</span>
                  <span>•</span>
                  <span>
                    {selectedExp.participantsCount}{" "}
                    {selectedExp.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">ITBIS (18%) Incluido</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
              <div className="text-center sm:text-right w-full sm:w-auto">
                <span className="text-xs text-slate-400 block font-medium">Precio Total</span>
                <span className="text-3xl font-black text-orange-500 font-mono">
                  {formatCurrency(selectedExp.price, "USD")}
                </span>
                <span className="text-xs text-slate-400 font-mono block">
                  ~ {formatCurrency(convertToDop(selectedExp.price, tenant.exchangeRate), "DOP")}
                </span>
              </div>

              <Link
                href={`/${params.tenantSlug}/booking?exp=${selectedExp.id}`}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
              >
                <span>{t("continueToBookingBtn")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Floating Sticky Bottom Bar: Only visible when main banner is outside the viewport */}
      {selectedExp && (
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 shadow-2xl transition-all duration-300 transform ${
            !isBannerVisible
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={selectedExp.imageUrl}
                alt={selectedExp.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700 hidden sm:block flex-shrink-0"
              />
              <div className="truncate">
                <span className="text-xs text-slate-400 block truncate">
                  Paso 1: <strong className="text-white">{selectedExp.name}</strong>
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-orange-400">
                    {formatCurrency(selectedExp.price, "USD")}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    {selectedExp.participantsCount} {selectedExp.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/${params.tenantSlug}/booking?exp=${selectedExp.id}`}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2 flex-shrink-0 transition-all hover:scale-[1.02]"
            >
              <span className="hidden sm:inline">{t("continueToBookingBtn")}</span>
              <span className="sm:hidden">Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

