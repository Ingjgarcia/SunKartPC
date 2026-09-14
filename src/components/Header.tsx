"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Zap, ShieldCheck, CreditCard, QrCode, BarChart3, LogIn, LogOut, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Demo Notification Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1 text-center text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5" />
        <span>{t("demoBanner")}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/sunkart-pc" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <img src="/images/sunkart-logo.png" alt="SunKart Park" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight flex items-center gap-1.5">
              SunKart <span className="text-orange-500">Park</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block -mt-1 tracking-widest uppercase">
              Punta Cana · AdventureOS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 text-sm">
          <Link
            href="/sunkart-pc"
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              pathname.startsWith("/sunkart-pc") && !pathname.includes("/pass/")
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {t("navCatalog")}
          </Link>
          <Link
            href="/dashboard/cashier"
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              pathname === "/dashboard/cashier"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{t("navPos")}</span>
          </Link>
          <Link
            href="/dashboard/scanner"
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              pathname === "/dashboard/scanner"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{t("navScanner")}</span>
          </Link>
          <Link
            href="/dashboard/admin"
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              pathname === "/dashboard/admin"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t("navDashboard")}</span>
          </Link>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Cambiar idioma / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-mono">{lang === "es" ? "ES (Español)" : "EN (English)"}</span>
          </button>

          {/* Authentication Status / Login Button */}
          {session?.user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-none truncate max-w-[130px]">
                  {session.user.name}
                </span>
                <span className="text-[9px] text-orange-400 font-mono font-bold leading-tight mt-0.5">
                  {(session.user as any).role || "STAFF"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800/50 transition-colors flex items-center gap-1 text-xs"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px] font-medium">Salir</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700 transition-all hover:border-slate-600"
            >
              <LogIn className="w-3.5 h-3.5 text-orange-400" />
              <span>{t("navStaffLogin")}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
