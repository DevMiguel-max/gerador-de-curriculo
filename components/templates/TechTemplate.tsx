import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const ACCENT = "#0E7A5F";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "básico",
  intermediate: "intermediário",
  advanced: "avançado",
  fluent: "fluente",
  native: "nativo",
};

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-2 mt-6 text-[10pt] font-bold first:mt-0" style={{ fontFamily: MONO, color: INK }}>
      <span style={{ color: ACCENT }}>{"// "}</span>
      {children.toLowerCase()}
    </h2>
  );
}

export function TechTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;

  const contact = [
    p.email,
    p.phone,
    [p.city, p.stateProvince].filter(Boolean).join(", "),
    hasValue(p.github) ? p.github.value : null,
    hasValue(p.linkedin) ? p.linkedin.value : null,
    hasValue(p.portfolio) ? p.portfolio.value : null,
  ].filter(Boolean);

  return (
    <TemplatePage className="px-[16mm] py-[14mm]">
      <header className="border-b-2 pb-3" style={{ borderColor: ACCENT }}>
        <h1 className="text-[19pt] font-bold" style={{ color: INK }}>
          {p.fullName || "Seu nome"}
        </h1>
        {p.professionalTitle && (
          <p className="mt-0.5 text-[10pt]" style={{ color: ACCENT, fontFamily: MONO }}>
            {p.professionalTitle}
          </p>
        )}
        {contact.length > 0 && (
          <p className="mt-2 text-[8.5pt]" style={{ color: MUTED, fontFamily: MONO }}>
            {contact.join("  ·  ")}
          </p>
        )}
      </header>

      {hasText(resume.professionalSummary) && (
        <section>
          <Heading>perfil</Heading>
          <p style={{ color: INK }}>{resume.professionalSummary}</p>
        </section>
      )}

      {resume.hasProfessionalExperience === true && resume.experiences.length > 0 && (
        <section>
          <Heading>experiência</Heading>
          <div className="flex flex-col gap-3">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold" style={{ color: INK }}>
                    {exp.position} <span style={{ color: MUTED, fontWeight: 400 }}>@ {exp.company}</span>
                  </span>
                  <span className="text-[8.5pt]" style={{ color: ACCENT, fontFamily: MONO }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
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

      {hasItems(resume.skills) && (
        <section>
          <Heading>stack &amp; habilidades</Heading>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.items.map((s) => (
              <span
                key={s.id}
                className="rounded border px-2 py-0.5 text-[8.5pt]"
                style={{ borderColor: ACCENT, color: INK, fontFamily: MONO }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.projects) && (
        <section>
          <Heading>projetos</Heading>
          <div className="flex flex-col gap-2.5">
            {resume.projects.items.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold" style={{ color: INK }}>
                    {proj.name}
                  </span>
                  {proj.url && (
                    <span className="text-[8.5pt]" style={{ color: ACCENT, fontFamily: MONO }}>
                      {proj.url}
                    </span>
                  )}
                </div>
                {hasText(proj.description) && <p style={{ color: INK }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-[8.5pt]" style={{ color: MUTED, fontFamily: MONO }}>
                    {proj.technologies.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section>
          <Heading>formação</Heading>
          <div className="flex flex-col gap-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <span style={{ color: INK }}>
                  <span className="font-bold">{edu.course}</span>
                  {edu.institution ? ` — ${edu.institution}` : ""}
                </span>
                <span className="text-[8.5pt]" style={{ color: ACCENT, fontFamily: MONO }}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(hasItems(resume.courses) || hasItems(resume.certifications)) && (
        <section>
          <Heading>cursos &amp; certificações</Heading>
          <ul className="list-disc pl-5">
            {[...resume.courses.items, ...resume.certifications.items].map((c) => (
              <li key={c.id} style={{ color: INK }}>
                {c.name} {c.institution ? `— ${c.institution}` : ""}{" "}
                {c.date ? `(${formatMonthYear(c.date)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasItems(resume.languages) && (
        <section>
          <Heading>idiomas</Heading>
          <p style={{ color: INK }}>
            {resume.languages.items
              .map((l) => `${l.language} (${PROFICIENCY_LABEL[l.proficiency]})`)
              .join(", ")}
          </p>
        </section>
      )}
    </TemplatePage>
  );
}
