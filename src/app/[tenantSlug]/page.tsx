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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{t("catalogTitle")}</h2>
            <p className="text-sm text-slate-400">{t("catalogSubtitle")}</p>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg">
            {experiences.length} {t("catalogAvailable")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => {
            const priceDop = convertToDop(exp.price, tenant.exchangeRate);
            const description = getLocalizedDesc(exp.slug, exp.description);

            return (
              <div
                key={exp.id}
                className={`group relative bg-slate-900/70 border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${
                  exp.isPackage
                    ? "border-orange-500/50 shadow-orange-500/10 hover:border-orange-500"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Package Badge */}
                {exp.isPackage && (
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t("vipPackageBadge")}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                  <img
                    src={exp.imageUrl}
                    alt={exp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{exp.durationMinutes} min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {exp.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {description}
                    </p>

                    {/* Requirements Tags */}
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                      {exp.minimumAge && (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {t("minAgeLabel")} {exp.minimumAge} {t("yearsLabel")}
                        </span>
                      )}
                      {exp.minimumHeightCm && (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {t("minHeightLabel")} {exp.minimumHeightCm} cm
                        </span>
                      )}
                      <span className="bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60">
                        {t("waiverRequiredBadge")}
                      </span>
                    </div>

                    {/* Package inclusions */}
                    {exp.activities && (
                      <div className="mt-3 p-2.5 rounded-lg bg-orange-950/20 border border-orange-900/30 text-[11px] text-orange-300">
                        <span className="font-semibold block mb-1">{t("includesTitle")}</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {exp.activities.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">
                        {formatCurrency(exp.price, "USD")}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ~ {formatCurrency(priceDop, "DOP")}
                      </div>
                    </div>

                    <Link
                      href={`/sunkart-pc/booking?exp=${exp.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all group-hover:scale-105"
                    >
                      <span>{t("bookButton")}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
