import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const INK = "#111111";
const MUTED = "#8A8A8A";

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "básico",
  intermediate: "intermediário",
  advanced: "avançado",
  fluent: "fluente",
  native: "nativo",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-3 mt-8 text-[8.5pt] font-medium uppercase first:mt-0"
      style={{ color: MUTED, letterSpacing: "0.18em" }}
    >
      {children}
    </h2>
  );
}

export function MinimalTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;

  const contact = [
    p.email,
    p.phone,
    [p.city, p.stateProvince].filter(Boolean).join(", "),
    hasValue(p.linkedin) ? p.linkedin.value : null,
    hasValue(p.github) ? p.github.value : null,
    hasValue(p.portfolio) ? p.portfolio.value : null,
    hasValue(p.website) ? p.website.value : null,
  ].filter(Boolean);

  return (
    <TemplatePage className="px-[22mm] py-[20mm]">
      <header>
        <h1 className="text-[18pt] font-light" style={{ color: INK, letterSpacing: "0.02em" }}>
          {p.fullName || "Seu nome"}
        </h1>
        {p.professionalTitle && (
          <p className="mt-1 text-[10pt]" style={{ color: MUTED }}>
            {p.professionalTitle}
          </p>
        )}
        {contact.length > 0 && (
          <p className="mt-3 text-[8.5pt]" style={{ color: MUTED }}>
            {contact.join("   ")}
          </p>
        )}
      </header>

      {hasText(resume.professionalSummary) && (
        <section>
          <Heading>Perfil</Heading>
          <p style={{ color: INK }}>{resume.professionalSummary}</p>
        </section>
      )}

      {resume.hasProfessionalExperience === true && resume.experiences.length > 0 && (
        <section>
          <Heading>Experiência</Heading>
          <div className="flex flex-col gap-4">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <span style={{ color: INK }}>
                    <span className="font-medium">{exp.position}</span>
                    {exp.company ? `, ${exp.company}` : ""}
                  </span>
                  <span className="text-[8.5pt]" style={{ color: MUTED }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {hasText(exp.description) && (
                  <p className="mt-1" style={{ color: INK }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements.filter(hasText).length > 0 && (
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {exp.achievements.filter(hasText).map((a, i) => (
                      <li key={i} style={{ color: INK }}>
                        — {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section>
          <Heading>Formação</Heading>
          <div className="flex flex-col gap-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <span style={{ color: INK }}>
                  <span className="font-medium">{edu.course}</span>
                  {edu.institution ? `, ${edu.institution}` : ""}
                </span>
                <span className="text-[8.5pt]" style={{ color: MUTED }}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.projects) && (
        <section>
          <Heading>Projetos</Heading>
          <div className="flex flex-col gap-2">
            {resume.projects.items.map((proj) => (
              <div key={proj.id}>
                <span className="font-medium" style={{ color: INK }}>
                  {proj.name}
                </span>
                {hasText(proj.description) && <p style={{ color: INK }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(hasItems(resume.courses) || hasItems(resume.certifications)) && (
        <section>
          <Heading>Cursos e certificações</Heading>
          <p style={{ color: INK }}>
            {[...resume.courses.items, ...resume.certifications.items]
              .map((c) => c.name)
              .join("   ·   ")}
          </p>
        </section>
      )}

      {hasItems(resume.skills) && (
        <section>
          <Heading>Habilidades</Heading>
          <p style={{ color: INK }}>{resume.skills.items.map((s) => s.name).join("   ·   ")}</p>
        </section>
      )}

      {hasItems(resume.languages) && (
        <section>
          <Heading>Idiomas</Heading>
          <p style={{ color: INK }}>
            {resume.languages.items
              .map((l) => `${l.language} (${PROFICIENCY_LABEL[l.proficiency]})`)
              .join("   ·   ")}
          </p>
        </section>
      )}

      {hasItems(resume.volunteering) && (
        <section>
          <Heading>Voluntariado</Heading>
          <div className="flex flex-col gap-1">
            {resume.volunteering.items.map((v) => (
              <p key={v.id} style={{ color: INK }}>
                {v.role}, {v.organization}
              </p>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.awards) && (
        <section>
          <Heading>Prêmios</Heading>
          <p style={{ color: INK }}>{resume.awards.items.map((a) => a.name).join("   ·   ")}</p>
        </section>
      )}
    </TemplatePage>
  );
}
