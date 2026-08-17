"use client";

import { useRef, useState } from "react";
import { User, Upload, X } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { AbsenceCheckbox } from "@/components/ui/AbsenceCheckbox";
import { IconButton } from "@/components/ui/IconButton";
import { resizeImageToDataUrl, InvalidImageError } from "@/lib/utils/image";

export function Step01PersonalInfo() {
  const personalInfo = useResumeStore((s) => s.resume.personalInfo);
  const setPersonalInfoField = useResumeStore((s) => s.setPersonalInfoField);
  const setPersonalLinkField = useResumeStore((s) => s.setPersonalLinkField);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPersonalLinkField("photo", { status: "provided", value: dataUrl });
    } catch (err) {
      setPhotoError(
        err instanceof InvalidImageError ? err.message : "Não foi possível processar a imagem.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const photoAbsent = personalInfo.photo.status === "not_available";
  const hasPhoto = personalInfo.photo.status === "provided" && personalInfo.photo.value;

  return (
    <SectionCard
      title="Dados pessoais"
      description="Como as pessoas vão encontrar e reconhecer você no currículo."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            label="Nome completo"
            value={personalInfo.fullName}
            onChange={(e) => setPersonalInfoField("fullName", e.target.value)}
            placeholder="Ex.: Maria Oliveira Santos"
            autoComplete="name"
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            label="Título profissional"
            value={personalInfo.professionalTitle}
            onChange={(e) => setPersonalInfoField("professionalTitle", e.target.value)}
            placeholder="Ex.: Técnica em Automação Industrial"
            hint="Como você se apresenta profissionalmente — aparece logo abaixo do seu nome."
            optional
          />
        </div>
        <TextField
          label="E-mail"
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfoField("email", e.target.value)}
          placeholder="voce@email.com"
          autoComplete="email"
        />
        <TextField
          label="Telefone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfoField("phone", e.target.value)}
          placeholder="(11) 91234-5678"
          autoComplete="tel"
        />
        <TextField
          label="Cidade"
          value={personalInfo.city}
          onChange={(e) => setPersonalInfoField("city", e.target.value)}
          placeholder="Uberlândia"
        />
        <TextField
          label="Estado"
          value={personalInfo.stateProvince}
          onChange={(e) => setPersonalInfoField("stateProvince", e.target.value)}
          placeholder="MG"
        />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-medium text-ink">Foto</h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              Opcional. Nem todo template exibe foto.
            </p>
          </div>
          <AbsenceCheckbox
            label="Não desejo adicionar foto"
            checked={photoAbsent}
            onChange={(checked) =>
              setPersonalLinkField("photo", {
                status: checked ? "not_available" : "not_provided",
                value: null,
              })
            }
          />
        </div>

        {!photoAbsent && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg">
              {hasPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={personalInfo.photo.value as string}
                  alt="Pré-visualização da foto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40"
                >
                  <Upload className="h-4 w-4" />
                  {hasPhoto ? "Trocar foto" : "Enviar foto"}
                </button>
                {hasPhoto && (
                  <IconButton
                    icon={X}
                    label="Remover foto"
                    variant="danger"
                    onClick={() =>
                      setPersonalLinkField("photo", { status: "not_provided", value: null })
                    }
                  />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoError && <p className="text-xs text-danger">{photoError}</p>}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
