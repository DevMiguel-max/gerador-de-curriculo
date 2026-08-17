import type { ResumeData } from "@/types/resume";
import { emptyField, emptyList } from "@/types/resume";
import { generateId } from "@/lib/utils/id";

export function createBlankResume(): ResumeData {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    personalInfo: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      city: "",
      stateProvince: "",
      photo: emptyField(),
      linkedin: emptyField(),
      github: emptyField(),
      portfolio: emptyField(),
      website: emptyField(),
      otherLinks: emptyList(),
    },
    professionalSummary: "",
    objective: "",
    targetJob: "",
    jobDescription: "",
    hasProfessionalExperience: null,
    experiences: [],
    education: [],
    courses: emptyList(),
    certifications: emptyList(),
    skills: emptyList(),
    languages: emptyList(),
    projects: emptyList(),
    volunteering: emptyList(),
    awards: emptyList(),
    additionalInfo: emptyField(),
    settings: {
      templateId: "classic",
      density: "standard",
      fontSize: "medium",
      showPhoto: true,
    },
    createdAt: now,
    updatedAt: now,
  };
}
