import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Education,
  Experience,
  FieldState,
  FieldStatus,
  Link,
  ListField,
  PersonalInfo,
  ResumeData,
} from "@/types/resume";
import type { AIResumeContent } from "@/schemas/resume.schema";
import { createBlankResume } from "@/lib/utils/resumeFactory";
import { generateId } from "@/lib/utils/id";

export const FORM_STEPS = [
  "personal-info",
  "objective",
  "experience",
  "education",
  "courses-certifications",
  "skills",
  "languages",
  "projects",
  "links",
  "target-job",
] as const;

export type FormStepId = (typeof FORM_STEPS)[number];

export type ListFieldKey =
  | "courses"
  | "certifications"
  | "skills"
  | "languages"
  | "projects"
  | "volunteering"
  | "awards";

type ListItemOf<K extends ListFieldKey> = ResumeData[K]["items"][number];

type PersonalLinkKey = "photo" | "linkedin" | "github" | "portfolio" | "website";

interface ResumeStoreState {
  resume: ResumeData;
  currentStep: FormStepId;
  hasHydrated: boolean;
  setHasHydrated: () => void;

  // navegação
  setStep: (step: FormStepId) => void;
  goNext: () => void;
  goBack: () => void;

  // dados pessoais
  setPersonalInfoField: (
    key: Extract<
      keyof PersonalInfo,
      "fullName" | "professionalTitle" | "email" | "phone" | "city" | "stateProvince"
    >,
    value: string,
  ) => void;
  setPersonalLinkField: (
    key: PersonalLinkKey,
    patch: Partial<FieldState<string>>,
  ) => void;
  addOtherLink: (link: Link) => void;
  updateOtherLink: (index: number, patch: Partial<Link>) => void;
  removeOtherLink: (index: number) => void;
  setOtherLinksStatus: (status: FieldStatus) => void;

  // resumo / objetivo / vaga
  setProfessionalSummary: (value: string) => void;
  setObjective: (value: string) => void;
  setTargetJob: (value: string) => void;
  setJobDescription: (value: string) => void;
  setAdditionalInfo: (patch: Partial<FieldState<string>>) => void;

  // experiência
  setHasProfessionalExperience: (value: boolean | null) => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: "up" | "down") => void;

  // formação
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // listas opcionais genéricas (cursos, certificações, habilidades,
  // idiomas, projetos, voluntariado, prêmios)
  setListStatus: (key: ListFieldKey, status: FieldStatus) => void;
  addListItem: <K extends ListFieldKey>(key: K, item: ListItemOf<K>) => void;
  updateListItem: <K extends ListFieldKey>(
    key: K,
    id: string,
    patch: Partial<ListItemOf<K>>,
  ) => void;
  removeListItem: (key: ListFieldKey, id: string) => void;

  // template (Fase 3-4)
  setTemplate: (templateId: ResumeData["settings"]["templateId"]) => void;

  // IA (Fase 5) — aplica um AIResumeContent já validado pelo Zod no
  // servidor. Uma seção que o usuário marcou "not_available" nunca é
  // reaberta por isso: só entra em "provided" se a IA de fato devolveu
  // itens; do contrário o status anterior é preservado.
  applyAIContent: (content: AIResumeContent) => void;

  // rascunho
  resetDraft: () => void;
}

function touch(resume: ResumeData): ResumeData {
  return { ...resume, updatedAt: new Date().toISOString() };
}

export const useResumeStore = create<ResumeStoreState>()(
  persist(
    (set, get) => ({
      resume: createBlankResume(),
      currentStep: "personal-info",
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),

      setStep: (step) => set({ currentStep: step }),
      goNext: () => {
        const idx = FORM_STEPS.indexOf(get().currentStep);
        const next = FORM_STEPS[Math.min(idx + 1, FORM_STEPS.length - 1)]!;
        set({ currentStep: next });
      },
      goBack: () => {
        const idx = FORM_STEPS.indexOf(get().currentStep);
        const prev = FORM_STEPS[Math.max(idx - 1, 0)]!;
        set({ currentStep: prev });
      },

      setPersonalInfoField: (key, value) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            personalInfo: { ...s.resume.personalInfo, [key]: value },
          }),
        })),

      setPersonalLinkField: (key, patch) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            personalInfo: {
              ...s.resume.personalInfo,
              [key]: { ...s.resume.personalInfo[key], ...patch },
            },
          }),
        })),

      addOtherLink: (link) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            personalInfo: {
              ...s.resume.personalInfo,
              otherLinks: {
                status: "provided",
                items: [...s.resume.personalInfo.otherLinks.items, link],
              },
            },
          }),
        })),
      updateOtherLink: (index, patch) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            personalInfo: {
              ...s.resume.personalInfo,
              otherLinks: {
                ...s.resume.personalInfo.otherLinks,
                items: s.resume.personalInfo.otherLinks.items.map((it, i) =>
                  i === index ? { ...it, ...patch } : it,
                ),
              },
            },
          }),
        })),
      removeOtherLink: (index) =>
        set((s) => {
          const items = s.resume.personalInfo.otherLinks.items.filter(
            (_, i) => i !== index,
          );
          return {
            resume: touch({
              ...s.resume,
              personalInfo: {
                ...s.resume.personalInfo,
                otherLinks: {
                  status: items.length > 0 ? "provided" : "not_provided",
                  items,
                },
              },
            }),
          };
        }),
      setOtherLinksStatus: (status) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            personalInfo: {
              ...s.resume.personalInfo,
              otherLinks: {
                status,
                items:
                  status === "not_available"
                    ? []
                    : s.resume.personalInfo.otherLinks.items,
              },
            },
          }),
        })),

      setProfessionalSummary: (value) =>
        set((s) => ({ resume: touch({ ...s.resume, professionalSummary: value }) })),
      setObjective: (value) =>
        set((s) => ({ resume: touch({ ...s.resume, objective: value }) })),
      setTargetJob: (value) =>
        set((s) => ({ resume: touch({ ...s.resume, targetJob: value }) })),
      setJobDescription: (value) =>
        set((s) => ({ resume: touch({ ...s.resume, jobDescription: value }) })),
      setAdditionalInfo: (patch) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            additionalInfo: { ...s.resume.additionalInfo, ...patch },
          }),
        })),

      setHasProfessionalExperience: (value) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            hasProfessionalExperience: value,
            // seção 22: primeiro emprego limpa experiências existentes
            experiences: value === false ? [] : s.resume.experiences,
          }),
        })),
      addExperience: () =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            experiences: [
              ...s.resume.experiences,
              {
                id: generateId(),
                company: "",
                position: "",
                startDate: "",
                current: false,
                description: "",
                achievements: [],
              },
            ],
          }),
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            experiences: s.resume.experiences.map((e) =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          }),
        })),
      removeExperience: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            experiences: s.resume.experiences.filter((e) => e.id !== id),
          }),
        })),
      moveExperience: (id, direction) =>
        set((s) => {
          const list = [...s.resume.experiences];
          const idx = list.findIndex((e) => e.id === id);
          const swapWith = direction === "up" ? idx - 1 : idx + 1;
          if (idx < 0 || swapWith < 0 || swapWith >= list.length) return s;
          [list[idx], list[swapWith]] = [list[swapWith]!, list[idx]!];
          return { resume: touch({ ...s.resume, experiences: list }) };
        }),

      addEducation: () =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            education: [
              ...s.resume.education,
              {
                id: generateId(),
                institution: "",
                course: "",
                level: "",
                startDate: "",
                current: false,
              },
            ],
          }),
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            education: s.resume.education.map((e) =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          }),
        })),
      removeEducation: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            education: s.resume.education.filter((e) => e.id !== id),
          }),
        })),

      setListStatus: (key, status) =>
        set((s) => {
          const list = s.resume[key] as ListField<unknown>;
          const updated = {
            ...s.resume,
            [key]: { status, items: status === "not_available" ? [] : list.items },
          } as ResumeData;
          return { resume: touch(updated) };
        }),
      addListItem: (key, item) =>
        set((s) => {
          const list = s.resume[key] as ListField<unknown>;
          const updated = {
            ...s.resume,
            [key]: { status: "provided" as const, items: [...list.items, item] },
          } as ResumeData;
          return { resume: touch(updated) };
        }),
      updateListItem: (key, id, patch) =>
        set((s) => {
          const list = s.resume[key] as ListField<{ id: string }>;
          const updated = {
            ...s.resume,
            [key]: {
              ...list,
              items: list.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
            },
          } as ResumeData;
          return { resume: touch(updated) };
        }),
      removeListItem: (key, id) =>
        set((s) => {
          const list = s.resume[key] as ListField<{ id: string }>;
          const items = list.items.filter((it) => it.id !== id);
          const updated = {
            ...s.resume,
            [key]: { status: items.length > 0 ? ("provided" as const) : ("not_provided" as const), items },
          } as ResumeData;
          return { resume: touch(updated) };
        }),

      setTemplate: (templateId) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            settings: { ...s.resume.settings, templateId },
          }),
        })),

      applyAIContent: (content) =>
        set((s) => {
          const preserveStatus = <T>(current: ListField<T>, incoming: T[]): ListField<T> => ({
            status: incoming.length > 0 ? "provided" : current.status,
            items: incoming.length > 0 ? incoming : current.items,
          });
          return {
            resume: touch({
              ...s.resume,
              professionalSummary: content.professionalSummary,
              objective: content.objective,
              experiences: content.experiences,
              education: content.education,
              courses: preserveStatus(s.resume.courses, content.courses),
              certifications: preserveStatus(s.resume.certifications, content.certifications),
              skills: preserveStatus(s.resume.skills, content.skills),
              languages: preserveStatus(s.resume.languages, content.languages),
              projects: preserveStatus(s.resume.projects, content.projects),
              volunteering: preserveStatus(s.resume.volunteering, content.volunteering),
              awards: preserveStatus(s.resume.awards, content.awards),
            }),
          };
        }),

      resetDraft: () => set({ resume: createBlankResume(), currentStep: "personal-info" }),
    }),
    {
      name: "gerador-curriculos:draft",
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(),
      partialize: (s) => ({ resume: s.resume, currentStep: s.currentStep }),
    },
  ),
);
