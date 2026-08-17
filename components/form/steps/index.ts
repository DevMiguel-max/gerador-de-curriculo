import type { FormStepId } from "@/lib/store/resumeStore";
import { Step01PersonalInfo } from "./Step01PersonalInfo";
import { Step02Objective } from "./Step02Objective";
import { Step03Experience } from "./Step03Experience";
import { Step04Education } from "./Step04Education";
import { Step05CoursesCertifications } from "./Step05CoursesCertifications";
import { Step06Skills } from "./Step06Skills";
import { Step07Languages } from "./Step07Languages";
import { Step08Projects } from "./Step08Projects";
import { Step09Links } from "./Step09Links";
import { Step10TargetJob } from "./Step10TargetJob";

export const STEP_COMPONENTS: Record<FormStepId, React.ComponentType> = {
  "personal-info": Step01PersonalInfo,
  objective: Step02Objective,
  experience: Step03Experience,
  education: Step04Education,
  "courses-certifications": Step05CoursesCertifications,
  skills: Step06Skills,
  languages: Step07Languages,
  projects: Step08Projects,
  links: Step09Links,
  "target-job": Step10TargetJob,
};
