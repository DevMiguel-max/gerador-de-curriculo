"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, AlertCircle, Lightbulb } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { optimizeResumeContent, AIRequestError } from "@/lib/ai/client";
import type { JobAnalysisResult } from "@/lib/ai/provider";
import { Button } from "@/components/ui/Button";

const LOADING_MESSAGES = [
  "Analisando seus dados...",
  "Organizando suas experiências...",
  "Melhorando seu resumo...",
  "Adaptando seu currículo à vaga...",
  "Preparando seu currículo...",
];

export function OptimizeWithAI() {
  const resume = useResumeStore((s) => s.resume);
  const applyAIContent = useResumeStore((s) => s.applyAIContent);
  const hasJobDescription = Boolean(resume.jobDescription.trim());

  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (status === "loading") {
      setMessageIndex(0);
      intervalRef.current = setInterval(() => {
        setMessageIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
      }, 1800);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status]);

  async function handleClick() {
    setStatus("loading");
    setErrorMessage(null);
    setJobAnalysis(null);
    setSuggestions([]);
    try {
      const result = await optimizeResumeContent(resume);
      applyAIContent(result.content);
      setJobAnalysis(result.jobAnalysis ?? null);
      setSuggestions(result.suggestions ?? []);
      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof AIRequestError ? err.message : "Não foi possível otimizar agora.",
      );
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button variant="secondary" onClick={handleClick} disabled={status === "loading"}>
        <Sparkles className="h-4 w-4" />
        {status === "loading"
          ? LOADING_MESSAGES[messageIndex]
          : hasJobDescription
            ? "Adaptar à vaga com IA"
            : "Otimizar com IA"}
      </Button>

      {status === "error" && errorMessage && (
        <p className="flex items-center gap-1 text-xs text-danger">
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <div className="w-full max-w-sm rounded-md border border-border bg-white p-3 text-left text-xs">
          <p className="mb-2 font-medium text-success">Currículo atualizado.</p>

          {jobAnalysis && jobAnalysis.keywords.length > 0 && (
            <div className="mb-2">
              <p className="font-medium text-ink-muted">Palavras-chave da vaga identificadas</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {jobAnalysis.keywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-bg px-2 py-0.5 text-ink">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <p className="flex items-center gap-1 font-medium text-ink-muted">
                <Lightbulb className="h-3 w-3" />
                Sugestões (não aplicadas automaticamente)
              </p>
              <ul className="mt-1 list-disc pl-4 text-ink">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
