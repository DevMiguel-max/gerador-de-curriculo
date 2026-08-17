import { z } from "zod";

/**
 * Schemas Zod que espelham types/resume.ts.
 *
 * Dois usos distintos (seção 39 do briefing):
 *  1. `resumeDataSchema`      -> valida o estado completo da aplicação
 *     (o que fica salvo em localStorage/IndexedDB).
 *  2. `aiResumeContentSchema` -> valida ESTRITAMENTE o JSON devolvido pela
 *     IA antes de ele tocar o estado da aplicação. É deliberadamente mais
 *     restrito: não contém `settings`, `templateId`, `personalInfo` nem
 *     qualquer campo de contato — a IA nunca deveria opinar sobre isso.
 *
 * Fluxo (seção 3): IA -> JSON -> parse -> Zod -> válido -> merge no estado.
 * Se `aiResumeContentSchema.safeParse` falhar, o JSON é descartado e o
 * erro é tratado em lib/ai (Fase 5) — nunca aplicado parcialmente.
 */

const fieldStatusSchema = z.enum(["provided", "not_available", "not_provided"]);

const fieldState = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    status: fieldStatusSchema,
    value: valueSchema.nullable(),
  });

const listField = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    status: fieldStatusSchema,
    items: z.array(itemSchema),
  });

export const linkSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().url(),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1).max(160),
  position: z.string().min(1).max(160),
  location: z.string().max(160).optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(4000),
  achievements: z.array(z.string().max(400)).max(20),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1).max(200),
  course: z.string().min(1).max(200),
  level: z.string().min(1).max(80),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(2000).optional(),
});

export const courseSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  date: z.string().min(1),
  workloadHours: z.number().int().positive().optional(),
  description: z.string().max(1000).optional(),
  certificateUrl: z.string().url().optional(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  date: z.string().min(1),
  expirationDate: z.string().optional(),
  credentialId: z.string().max(120).optional(),
  url: z.string().url().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(80),
  category: z.enum(["technical", "behavioral", "tool", "technology", "other"]),
});

export const languageSchema = z.object({
  id: z.string(),
  language: z.string().min(1).max(60),
  proficiency: z.enum(["basic", "intermediate", "advanced", "fluent", "native"]),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(160),
  description: z.string().max(2000),
  technologies: z.array(z.string().max(60)).max(30),
  period: z.string().max(80).optional(),
  url: z.string().url().optional(),
});

export const volunteeringSchema = z.object({
  id: z.string(),
  organization: z.string().min(1).max(200),
  role: z.string().min(1).max(160),
  period: z.string().min(1).max(80),
  description: z.string().max(1000).optional(),
});

export const awardSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  date: z.string().min(1),
  description: z.string().max(1000).optional(),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(1).max(160),
  professionalTitle: z.string().max(160),
  email: z.string().email().or(z.literal("")),
  phone: z.string().max(40),
  city: z.string().max(120),
  stateProvince: z.string().max(120),
  photo: fieldState(z.string()),
  linkedin: fieldState(z.string().url()),
  github: fieldState(z.string().url()),
  portfolio: fieldState(z.string().url()),
  website: fieldState(z.string().url()),
  otherLinks: listField(linkSchema),
});

export const resumeSettingsSchema = z.object({
  templateId: z.enum(["classic", "modern", "minimal", "executive", "tech", "first-job"]),
  primaryColor: z.string().optional(),
  density: z.enum(["compact", "standard", "spacious"]),
  fontSize: z.enum(["small", "medium", "large"]),
  sectionOrder: z.array(z.string()).optional(),
  showPhoto: z.boolean(),
});

export const resumeDataSchema = z.object({
  id: z.string(),
  personalInfo: personalInfoSchema,

  professionalSummary: z.string().max(2000),
  objective: z.string().max(1000),

  targetJob: z.string().max(160),
  jobDescription: z.string().max(8000),

  hasProfessionalExperience: z.boolean().nullable(),
  experiences: z.array(experienceSchema).max(30),

  education: z.array(educationSchema).max(20),

  courses: listField(courseSchema),
  certifications: listField(certificationSchema),
  skills: listField(skillSchema),
  languages: listField(languageSchema),
  projects: listField(projectSchema),
  volunteering: listField(volunteeringSchema),
  awards: listField(awardSchema),

  additionalInfo: fieldState(z.string().max(2000)),

  settings: resumeSettingsSchema,

  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Schema restrito para a resposta da IA (seção 38).
 * Somente conteúdo — sem personalInfo, sem settings, sem template.
 */
export const aiResumeContentSchema = z.object({
  professionalSummary: z.string().max(2000),
  objective: z.string().max(1000),
  experiences: z.array(experienceSchema).max(30),
  education: z.array(educationSchema).max(20),
  courses: z.array(courseSchema).max(30),
  certifications: z.array(certificationSchema).max(30),
  skills: z.array(skillSchema).max(60),
  languages: z.array(languageSchema).max(15),
  projects: z.array(projectSchema).max(30),
  volunteering: z.array(volunteeringSchema).max(15),
  awards: z.array(awardSchema).max(20),
});

export type AIResumeContent = z.infer<typeof aiResumeContentSchema>;
