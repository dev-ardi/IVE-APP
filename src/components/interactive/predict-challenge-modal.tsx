"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Lightbulb, RotateCcw } from "lucide-react";
import { RenderFormula } from "@/modules/content/render-formula";

export interface ChallengeOption {
  id: string;
  text: string;
  formula?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PredictChallengeProps {
  title?: string;
  question: string;
  formula?: string;
  options: ChallengeOption[];
  onApplyHypothesis?: (optionId: string) => void;
}

export function PredictChallengeModal({
  title = "Tantangan Hipotesis Sebelum Simulasi",
  question,
  formula,
  options,
  onApplyHypothesis,
}: PredictChallengeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const selectedOption = options.find((o) => o.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setSelectedId(null);
    setHasSubmitted(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-stone-900 bg-amber-50/90 p-5 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-200 dark:bg-amber-950/40">
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 dark:border-amber-400/20">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-sm text-amber-900 dark:text-amber-300">
            🎯
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-200">
            {title}
          </span>
        </div>

        {hasSubmitted && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline dark:text-amber-300"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Hipotesis</span>
          </button>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-extrabold text-stone-900 dark:text-white">
          {question}
        </p>

        {formula && (
          <div className="my-2 flex justify-start rounded-xl border border-stone-300 bg-white/80 p-2 dark:border-stone-700 dark:bg-stone-900/80">
            <RenderFormula formula={formula} />
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={hasSubmitted}
                onClick={() => handleSelect(opt.id)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border-2 p-3 text-left text-xs font-bold transition-all ${
                  hasSubmitted
                    ? isSelected
                      ? opt.isCorrect
                        ? "border-emerald-600 bg-emerald-100/90 text-emerald-950 shadow-xs dark:bg-emerald-950/70 dark:text-emerald-200"
                        : "border-red-600 bg-red-100/90 text-red-950 shadow-xs dark:bg-red-950/70 dark:text-red-200"
                      : opt.isCorrect
                      ? "border-emerald-500/50 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 opacity-80"
                      : "border-stone-300 bg-white/40 text-stone-500 opacity-60 dark:border-stone-800 dark:bg-stone-900/40"
                    : "border-stone-900/30 bg-white text-stone-900 shadow-2xs hover:-translate-y-0.5 hover:border-stone-900 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-stone-900/20 bg-stone-100 font-mono text-[10px] font-black dark:border-stone-700 dark:bg-stone-800">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                  {opt.formula && (
                    <span className="ml-1">
                      <RenderFormula formula={opt.formula} />
                    </span>
                  )}
                </div>

                {hasSubmitted && isSelected && (
                  <span>
                    {opt.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasSubmitted && selectedOption && (
          <div className="mt-4 rounded-xl border border-stone-900/10 bg-white p-3.5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-bold text-stone-900 dark:text-white">
                  {selectedOption.isCorrect ? "🎉 Prediksi Anda Tepat!" : "💡 Pemikiran Yang Bagus, Mari Kita Buktikan:"}
                </span>
                <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                  {selectedOption.explanation}
                </p>
              </div>
            </div>

            {onApplyHypothesis && (
              <button
                type="button"
                onClick={() => onApplyHypothesis(selectedOption.id)}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-900 bg-amber-500 px-3 py-1.5 text-xs font-black text-stone-950 shadow-2xs transition-all hover:bg-amber-400 active:translate-y-0.5"
              >
                <span>Terapkan ke Parameter Simulasi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
