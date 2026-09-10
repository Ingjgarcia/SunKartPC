"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { demoStore } from "@/lib/demo-store";
import { ShieldAlert, Check, RefreshCw, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";

export default function WaiverPage({
  params,
}: {
  params: { tenantSlug: string };
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Booking draft state
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guardian details if there is any minor
  const [hasMinor, setHasMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("Padre / Madre");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");

  const waiverText = demoStore.waiverVersion.legalText;

  useEffect(() => {
    const saved = localStorage.getItem("adventureos_booking_draft");
    if (!saved) {
      router.push(`/${params.tenantSlug}`);
      return;
    }

    const parsed = JSON.parse(saved);
    setBookingDraft(parsed);

    // Check if any participant is a minor
    const minorExists = parsed.participants?.some((p: any) => p.isMinor);
    setHasMinor(!!minorExists);

    if (minorExists && parsed.customer) {
      setGuardianName(`${parsed.customer.firstName} ${parsed.customer.lastName}`);
      setGuardianPhone(parsed.customer.phone || "");
      setGuardianEmail(parsed.customer.email || "");
    }
  }, [params.tenantSlug, router]);

  // Canvas drawing functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#f97316"; // SunKart Orange signature line
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasSignature) {
      alert("Por favor dibuja tu firma electrónica en el recuadro indicado.");
      return;
    }

    if (!acceptedTerms) {
      alert("Debes aceptar los términos y condiciones de la exoneración legal.");
      return;
    }

    if (hasMinor && (!guardianName || !guardianRelation || !guardianPhone)) {
      alert("Por favor completa los datos obligatorios del padre/madre o tutor legal.");
      return;
    }

    setIsSubmitting(true);
    const canvas = canvasRef.current;
    const signatureData = canvas ? canvas.toDataURL("image/png") : "";

    // Record waiver in state
    const updatedDraft = {
      ...bookingDraft,
      waiver: {
        versionId: "wv-01",
        signedAt: new Date().toISOString(),
        hasSignature: true,
        signatureData,
        hasMinor,
        guardian: hasMinor
          ? {
              name: guardianName,
              relation: guardianRelation,
              phone: guardianPhone,
              email: guardianEmail,
            }
          : null,
      },
    };

    localStorage.setItem("adventureos_booking_draft", JSON.stringify(updatedDraft));
    setIsSubmitting(false);

    // Proceed to Checkout
    router.push(`/${params.tenantSlug}/checkout`);
  };

  if (!bookingDraft) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              Participantes
            </span>
            <span className="text-orange-500">———</span>
            <span className="text-orange-400 font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">2</span>
              Waiver Digital
            </span>
            <span className="text-slate-600">———</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">3</span>
              Checkout & Pago
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Legal Document Reader */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <h1 className="text-lg font-bold text-white">Acuerdo Legal de Exoneración de Responsabilidad</h1>
              </div>
              <span className="text-[11px] font-mono bg-slate-800 text-orange-300 px-2.5 py-1 rounded">
                Versión Legal v1.0
              </span>
            </div>

            {/* Scrollable Legal Contract Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans max-h-56 overflow-y-auto space-y-3">
              {waiverText.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Firmando en nombre de:{" "}
                <strong className="text-white">
                  {bookingDraft.participants.map((p: any) => p.fullName).join(", ")}
                </strong>
              </span>
            </div>
          </div>

          {/* Minor Guardian Block (Conditional if any minor exists) */}
          {hasMinor && (
            <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-bold text-amber-300">
                    Consentimiento Obligatorio de Padre / Tutor Legal
                  </h2>
                  <p className="text-xs text-amber-200/80 mt-1">
                    Uno o más participantes son menores de 18 años. La ley exige los datos y consentimiento expreso del padre, madre o tutor legal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">Nombre del Padre / Tutor</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">Parentesco o Relación</label>
                  <select
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="Padre / Madre">Padre / Madre</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Familiar Autorizado">Familiar Autorizado (+18)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">Teléfono del Tutor</label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="+1 (809) 000-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">Email del Tutor</label>
                  <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="tutor@ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Electronic Signature Pad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-white">Firma Electrónica</h2>
                <p className="text-xs text-slate-400">Dibuja tu firma con el dedo o ratón en el área delimitada.</p>
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Limpiar Firma
              </button>
            </div>

            <div className="relative border-2 border-dashed border-slate-700 rounded-xl bg-slate-950 overflow-hidden touch-none">
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-48 cursor-crosshair block"
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-600 text-sm font-medium">
                  Firma aquí con el dedo o ratón ✍️
                </div>
              )}
            </div>

            {/* Checkbox */}
            <label className="mt-4 flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500"
                required
              />
              <span className="text-xs text-slate-300 leading-normal">
                He leído, comprendo y acepto íntegramente las condiciones de la exoneración de responsabilidad civil y asunción de riesgo de SunKart Park Punta Cana.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-white text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <span>Confirmar Firma y Continuar al Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
