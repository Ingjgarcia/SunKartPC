"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Sparkles, Users, FileSignature, CreditCard, QrCode, Check } from "lucide-react";

export type StepNumber = 1 | 2 | 3 | 4 | 5;

interface BookingStepperProps {
  currentStep: StepNumber;
  tenantSlug: string;
}

export function BookingStepper({ currentStep, tenantSlug }: BookingStepperProps) {
  const { t } = useLanguage();

  const steps = [
    { number: 1, label: t("stepperStep1"), icon: Sparkles, path: `/${tenantSlug}` },
    { number: 2, label: t("stepperStep2"), icon: Users, path: `/${tenantSlug}/booking` },
    { number: 3, label: t("stepperStep3"), icon: FileSignature, path: `/${tenantSlug}/waiver` },
    { number: 4, label: t("stepperStep4"), icon: CreditCard, path: `/${tenantSlug}/checkout` },
    { number: 5, label: t("stepperStep5"), icon: QrCode, path: `/${tenantSlug}/success` },
  ];

  const currentStepObj = steps.find((s) => s.number === currentStep) || steps[0];
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-16 z-40 py-3 sm:py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Stepper */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
          {/* Active Progress Fill */}
          <div
            className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 z-0 transition-all duration-500"
            style={{ width: `calc(${progressPercent}% * 0.88)` }}
          />

          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const Icon = step.icon;

            const circle = (
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20 scale-110"
                    : isCompleted
                    ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-slate-900 border border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? "text-white" : "text-slate-500"}`} />
                )}
              </div>
            );

            return (
              <div key={step.number} className="flex flex-col items-center gap-1.5 z-10 group">
                {isCompleted ? (
                  <Link
                    href={step.path}
                    className="flex flex-col items-center gap-1.5 focus:outline-none"
                    title={`Volver a ${step.label}`}
                  >
                    {circle}
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                      {step.label}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    {circle}
                    <span
                      className={`text-[11px] font-semibold tracking-tight ${
                        isCurrent
                          ? "text-orange-400 font-bold"
                          : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-[11px]">
                {currentStep}
              </span>
              <span className="font-bold text-slate-200">{currentStepObj.label}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Paso {currentStep} de 5
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
