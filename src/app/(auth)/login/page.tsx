"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, CreditCard, QrCode } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      if (email.includes("cashier")) {
        router.push("/dashboard/cashier");
      } else if (email.includes("staff")) {
        router.push("/dashboard/scanner");
      } else {
        router.push("/dashboard/admin");
      }
    }
  };

  const handleQuickLogin = (roleEmail: string, targetPath: string) => {
    setEmail(roleEmail);
    setPassword("demo123");
    // Direct redirect for seamless demo experience
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Acceso Staff & Administración</h2>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma Operativa • AdventureOS / SunKart Park
          </p>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-1">
            ⚡ Acceso Rápido Modo Demo (1-Click)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("cashier@sunkart.com", "/dashboard/cashier")}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-400">
                <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                <span>Caja POS</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cobro y órdenes</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("staff@sunkart.com", "/dashboard/scanner")}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-400">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Staff Escáner</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Validación QR</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@sunkart.com", "/dashboard/admin")}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-400">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Business Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Métricas y catálogo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("superadmin@adventureos.com", "/dashboard/admin")}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Plataforma SaaS</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 font-mono">o con credenciales</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="ejemplo@sunkart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? "Verificando..." : "Ingresar al Sistema"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
