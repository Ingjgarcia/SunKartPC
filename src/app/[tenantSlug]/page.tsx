"use client";

import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, convertToDop } from "@/lib/formatters";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Clock, Users, Shield, Sparkles, Trophy, ChevronRight } from "lucide-react";

export default function TenantCatalogPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const { lang, t } = useLanguage();
  const experiences = demoStore.experiences;
  const tenant = demoStore.tenant;

  const getLocalizedDesc = (slug: string, fallback: string) => {
    if (slug === "go-kart-adult") return t("expKartAdultDesc");
    if (slug === "go-kart-junior") return t("expKartJuniorDesc");
    if (slug === "paintball-combat") return t("expPaintballDesc");
    if (slug === "zipline-canopy") return t("expZiplineDesc");
    if (slug === "sky-adventure") return t("expSkyDesc");
    if (slug === "adventure-combo-vip") return t("expComboDesc");
    return fallback;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">{t("chooseExperienceTitle")}</h2>
          <p className="text-sm text-slate-400 mt-1">{t("chooseExperienceSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => {
            const priceDop = convertToDop(exp.price, tenant.exchangeRate);

            return (
              <Link
                key={exp.id}
                href={`/${params.tenantSlug}/booking?exp=${exp.id}`}
                className="group relative bg-[#121824] hover:bg-[#182030] border border-slate-800/90 hover:border-orange-500 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg tracking-tight group-hover:text-orange-400 transition-colors">
                    {exp.name}
                  </h3>

                  <div className="text-3xl font-black text-orange-500 font-mono my-3 tracking-tight">
                    {formatCurrency(exp.price, "USD")}
                  </div>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-medium w-fit mb-4">
                    {exp.participantsCount} {exp.participantsCount === 1 ? t("participantBadge") : t("participantsBadge")}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{exp.category}</span>
                  <span className="text-orange-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {t("bookButton")} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
