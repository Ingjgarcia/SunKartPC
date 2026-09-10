"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ShieldCheck, CreditCard, QrCode, BarChart3, LogIn, Globe } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"es" | "en">("es");

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Demo Notification Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1 text-center text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5" />
        <span>MODO DEMO ACTIVO — SunKart Park Punta Cana (AdventureOS v1.0)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/sunkart-pc" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tighter">SK</span>
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
            {lang === "es" ? "Catálogo" : "Catalog"}
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
            <span>{lang === "es" ? "Caja POS" : "POS Cashier"}</span>
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
            <span>{lang === "es" ? "Staff Escáner" : "Staff Scanner"}</span>
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
            <span>{lang === "es" ? "Dashboard" : "Dashboard"}</span>
          </Link>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Cambiar idioma"
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Login button */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700 transition-all hover:border-slate-600"
          >
            <LogIn className="w-3.5 h-3.5 text-orange-400" />
            <span>Acceso Staff</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
