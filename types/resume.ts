/**
 * Modelo central de dados do currículo.
 *
 * Princípio arquitetural (ver README.md):
 *  - Este arquivo descreve CONTEÚDO + ESTRUTURA de dados.
 *  - Nenhuma informação de apresentação (cor, fonte, layout) vive aqui —
 *    isso é responsabilidade de `ResumeSettings.templateId` + os
 *    componentes em `templates/`.
 *
 * Padrão de 3 estados (seções 18-20 do briefing):
 *  - "provided"      -> usuário forneceu o dado.
 *  - "not_available" -> usuário declarou explicitamente que não possui.
 *  - "not_provided"  -> usuário ainda não decidiu / não preencheu.
 *
 * Isso permite renderização condicional correta (seção 25): um campo
 * "not_available" nunca aparece no PDF, e nunca é preenchido pela IA.
 */

export type FieldStatus = "provided" | "not_available" | "not_provided";

/** Campo único opcional (ex.: LinkedIn, GitHub, foto). */
export interface FieldState<T> {
  status: FieldStatus;
  value: T | null;
}

/** Lista opcional (ex.: cursos, certificações, projetos). */
export interface ListField<T> {
  status: FieldStatus;
  items: T[];
}

export const emptyField = <T>(): FieldState<T> => ({
  status: "not_provided",
  value: null,
});

export const emptyList = <T>(): ListField<T> => ({
  status: "not_provided",
  items: [],
});

// ---------------------------------------------------------------------------
// Entidades
// ---------------------------------------------------------------------------

export interface Link {
  label: string;
  url: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // ISO "YYYY-MM"
  endDate?: string; // ISO "YYYY-MM", vazio se `current`
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  level: string; // ex.: "Ensino Médio", "Técnico", "Graduação", "Pós-graduação"
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  date: string;
  workloadHours?: number;
  description?: string;
  certificateUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export type SkillCategory =
  | "technical"
  | "behavioral"
  | "tool"
  | "technology"
  | "other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export type LanguageProficiency =
  | "basic"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "native";

export interface Language {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  period?: string;
  url?: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  period: string;
  description?: string;
}

export interface Award {
  id: string;
  name: string;
  institution: string;
  date: string;
  description?: string;
}

export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  city: string;
  stateProvince: string;
  photo: FieldState<string>; // data URL ou caminho do blob (IndexedDB)
  linkedin: FieldState<string>;
  github: FieldState<string>;
  portfolio: FieldState<string>;
  website: FieldState<string>;
  otherLinks: ListField<Link>;
}

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "tech"
  | "first-job";

export interface ResumeSettings {
  templateId: TemplateId;
  primaryColor?: string;
  density: "compact" | "standard" | "spacious";
  fontSize: "small" | "medium" | "large";
  sectionOrder?: string[];
  showPhoto: boolean;
}

/**
 * Estado central da aplicação para um currículo.
 * É isso que fica em localStorage/IndexedDB (seção 27) e é a "fonte da
 * verdade" que os templates consomem.
 */
export interface ResumeData {
  id: string;
  personalInfo: PersonalInfo;

  professionalSummary: string;
  objective: string;

  targetJob: string;
  jobDescription: string;

  /**
   * null   -> pergunta ainda não respondida
   * true   -> possui experiência profissional
   * false  -> primeiro emprego (seção 22-23): `experiences` deve ficar vazio
   */
  hasProfessionalExperience: boolean | null;
  experiences: Experience[];

  education: Education[];

  courses: ListField<Course>;
  certifications: ListField<Certification>;
  skills: ListField<Skill>;
  languages: ListField<Language>;
  projects: ListField<Project>;
  volunteering: ListField<Volunteering>;
  awards: ListField<Award>;

  additionalInfo: FieldState<string>;

  settings: ResumeSettings;

  createdAt: string;
  updatedAt: string;
}

/**
 * Subconjunto de ResumeData que a IA tem permissão de gerar/otimizar.
 * Ver lib/ai/provider.ts — a IA NUNCA recebe nem retorna `settings`,
 * `templateId`, HTML ou CSS.
 */
export type AIEditableContent = Pick<
  ResumeData,
  | "professionalSummary"
  | "objective"
  | "experiences"
  | "education"
  | "courses"
  | "certifications"
  | "skills"
  | "languages"
  | "projects"
  | "volunteering"
  | "awards"
>;
