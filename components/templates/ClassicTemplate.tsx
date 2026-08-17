import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const INK = "#1A1A1A";
const MUTED = "#4A4A4A";
const RULE = "#B8B8B8";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-2 mt-5 border-b pb-1 text-[10.5pt] font-bold uppercase tracking-wide"
      style={{ color: INK, borderColor: RULE, letterSpacing: "0.06em" }}
    >
      {children}
    </h2>
  );
}

export function ClassicTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;

  const contactLine = [
    p.city && p.stateProvince ? `${p.city}, ${p.stateProvince}` : p.city || p.stateProvince,
    p.phone,
    p.email,
    hasValue(p.linkedin) ? p.linkedin.value : null,
    hasValue(p.github) ? p.github.value : null,
    hasValue(p.portfolio) ? p.portfolio.value : null,
    hasValue(p.website) ? p.website.value : null,
  ]
    .filter(Boolean)
    .join("  •  ");

  return (
    <TemplatePage className="px-[18mm] py-[16mm]">
      <header className="text-center">
        <h1 className="text-[20pt] font-bold" style={{ color: INK, fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {p.fullName || "Seu nome"}
        </h1>
        {p.professionalTitle && (
          <p className="mt-0.5 text-[11pt]" style={{ color: MUTED }}>
            {p.professionalTitle}
          </p>
        )}
        {contactLine && (
          <p className="mt-1.5 text-[9pt]" style={{ color: MUTED }}>
            {contactLine}
          </p>
        )}
      </header>

      {hasText(resume.professionalSummary) && (
        <section>
          <Heading>Resumo</Heading>
          <p style={{ color: INK }}>{resume.professionalSummary}</p>
        </section>
      )}

      {hasText(resume.objective) && (
        <section>
          <Heading>Objetivo</Heading>
          <p style={{ color: INK }}>{resume.objective}</p>
        </section>
      )}

      {resume.hasProfessionalExperience === true && resume.experiences.length > 0 && (
        <section>
          <Heading>Experiência profissional</Heading>
          <div className="flex flex-col gap-3">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold" style={{ color: INK }}>
                    {exp.position}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </span>
                  <span className="text-[9pt]" style={{ color: MUTED }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[9pt] italic" style={{ color: MUTED }}>
                    {exp.location}
                  </p>
                )}
                {hasText(exp.description) && (
                  <p className="mt-1" style={{ color: INK }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements.filter(hasText).length > 0 && (
                  <ul className="mt-1 list-disc pl-5">
                    {exp.achievements.filter(hasText).map((a, i) => (
                      <li key={i} style={{ color: INK }}>
                        {a}
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
                  <span className="font-bold">{edu.course}</span>
                  {edu.institution ? ` — ${edu.institution}` : ""}
                  {edu.level ? ` (${edu.level})` : ""}
                </span>
                <span className="text-[9pt]" style={{ color: MUTED }}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.courses) && (
        <section>
          <Heading>Cursos</Heading>
          <ul className="list-disc pl-5">
            {resume.courses.items.map((c) => (
              <li key={c.id} style={{ color: INK }}>
                {c.name}
                {c.institution ? ` — ${c.institution}` : ""}
                {c.date ? ` (${formatMonthYear(c.date)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasItems(resume.certifications) && (
        <section>
          <Heading>Certificações</Heading>
          <ul className="list-disc pl-5">
            {resume.certifications.items.map((c) => (
              <li key={c.id} style={{ color: INK }}>
                {c.name}
                {c.institution ? ` — ${c.institution}` : ""}
                {c.date ? ` (${formatMonthYear(c.date)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasItems(resume.skills) && (
        <section>
          <Heading>Habilidades</Heading>
          <p style={{ color: INK }}>{resume.skills.items.map((s) => s.name).join(", ")}</p>
        </section>
      )}

      {hasItems(resume.languages) && (
        <section>
          <Heading>Idiomas</Heading>
          <p style={{ color: INK }}>
            {resume.languages.items
              .map((l) => `${l.language} (${PROFICIENCY_LABEL[l.proficiency]})`)
              .join(", ")}
          </p>
        </section>
      )}

      {hasItems(resume.projects) && (
        <section>
          <Heading>Projetos</Heading>
          <div className="flex flex-col gap-2">
            {resume.projects.items.map((proj) => (
              <div key={proj.id}>
                <span className="font-bold" style={{ color: INK }}>
                  {proj.name}
                </span>
                {hasText(proj.description) && (
                  <p style={{ color: INK }}>{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <p className="text-[9pt]" style={{ color: MUTED }}>
                    {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.volunteering) && (
        <section>
          <Heading>Voluntariado</Heading>
          <div className="flex flex-col gap-1.5">
            {resume.volunteering.items.map((v) => (
              <div key={v.id} className="flex items-baseline justify-between">
                <span style={{ color: INK }}>
                  <span className="font-bold">{v.role}</span>
                  {v.organization ? ` — ${v.organization}` : ""}
                </span>
                <span className="text-[9pt]" style={{ color: MUTED }}>
                  {v.period}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.awards) && (
        <section>
          <Heading>Prêmios e conquistas</Heading>
          <ul className="list-disc pl-5">
            {resume.awards.items.map((a) => (
              <li key={a.id} style={{ color: INK }}>
                {a.name}
                {a.institution ? ` — ${a.institution}` : ""}
                {a.date ? ` (${formatMonthYear(a.date)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasValue(resume.additionalInfo) && (
        <section>
          <Heading>Informações adicionais</Heading>
          <p style={{ color: INK }}>{resume.additionalInfo.value}</p>
        </section>
      )}
    </TemplatePage>
  );
}

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "básico",
  intermediate: "intermediário",
  advanced: "avançado",
  fluent: "fluente",
  native: "nativo",
};
