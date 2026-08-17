import type { TemplateId } from "@/types/resume";
import type { TemplateComponent } from "@/components/templates/types";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { TechTemplate } from "@/components/templates/TechTemplate";
import { FirstJobTemplate } from "@/components/templates/FirstJobTemplate";

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateComponent> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
  "first-job": FirstJobTemplate,
};

export const TEMPLATE_META: Record<TemplateId, { label: string; description: string; atsFriendly: boolean }> = {
  classic: {
    label: "Classic",
    description: "Tradicional, limpo, altamente legível — o mais seguro para ATS.",
    atsFriendly: true,
  },
  modern: {
    label: "Modern",
    description: "Sidebar colorida, hierarquia visual clara.",
    atsFriendly: false,
  },
  minimal: {
    label: "Minimal",
    description: "Minimalista, muito espaço em branco.",
    atsFriendly: true,
  },
  executive: {
    label: "Executive",
    description: "Corporativo e sofisticado, para quem já tem trajetória.",
    atsFriendly: false,
  },
  tech: {
    label: "Tech",
    description: "Para tecnologia, engenharia e automação.",
    atsFriendly: true,
  },
  "first-job": {
    label: "FirstJob",
    description: "Para primeiro emprego, estágio e jovem aprendiz.",
    atsFriendly: true,
  },
};
