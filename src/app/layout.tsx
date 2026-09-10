import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "SunKart Park Punta Cana | AdventureOS Management Platform",
  description:
    "Plataforma integral de venta de experiencias, reservas de go-karts, waivers digitales con firma electrónica, pagos online/caja y control de acceso con QR para parques de aventura.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        <SessionProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                © {new Date().getFullYear()} SunKart Park Punta Cana. Powered by{" "}
                <span className="text-orange-400 font-semibold">AdventureOS</span>.
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>ITBIS (18%) Incluido</span>
                <span>•</span>
                <span>Tasa 1 USD = RD$ 60.00</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Gateway: AZUL / Demo Mode</span>
              </div>
            </div>
          </footer>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
