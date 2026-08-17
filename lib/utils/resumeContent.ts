import type { ResumeData } from "@/types/resume";
import type { AIResumeContent } from "@/schemas/resume.schema";

export function toAIResumeContent(resume: ResumeData): AIResumeContent {
  return {
    professionalSummary: resume.professionalSummary,
    objective: resume.objective,
    experiences: resume.experiences,
    education: resume.education,
    courses: resume.courses.items,
    certifications: resume.certifications.items,
    skills: resume.skills.items,
    languages: resume.languages.items,
    projects: resume.projects.items,
    volunteering: resume.volunteering.items,
    awards: resume.awards.items,
  };
}
