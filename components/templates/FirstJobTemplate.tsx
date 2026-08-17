import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const ACCENT = "#C4622D";
const INK = "#242424";
const MUTED = "#6B6B6B";
const TINT = "#FBF1EA";

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "básico",
  intermediate: "intermediário",
  advanced: "avançado",
  fluent: "fluente",
  native: "nativo",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-6 text-[11pt] font-bold first:mt-0" style={{ color: ACCENT }}>
      {children}
    </h2>
  );
}

export function FirstJobTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;

  const contact = [
    p.email,
    p.phone,
    [p.city, p.stateProvince].filter(Boolean).join(", "),
    hasValue(p.linkedin) ? p.linkedin.value : null,
    hasValue(p.github) ? p.github.value : null,
    hasValue(p.portfolio) ? p.portfolio.value : null,
  ].filter(Boolean);

  return (
    <TemplatePage className="px-[18mm] py-[16mm]">
      <header className="flex items-center gap-4">
        {hasValue(p.photo) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.photo.value as string}
            alt=""
            className="h-[24mm] w-[24mm] shrink-0 rounded-full object-cover"
            style={{ border: `3px solid ${TINT}` }}
          />
        )}
        <div>
          <h1 className="text-[19pt] font-bold" style={{ color: INK }}>
            {p.fullName || "Seu nome"}
          </h1>
          {p.professionalTitle && (
            <p className="mt-0.5 text-[10.5pt]" style={{ color: ACCENT }}>
              {p.professionalTitle}
            </p>
          )}
          {contact.length > 0 && (
            <p className="mt-1.5 text-[8.5pt]" style={{ color: MUTED }}>
              {contact.join("   ·   ")}
            </p>
          )}
        </div>
      </header>

      {(hasText(resume.objective) || hasText(resume.professionalSummary)) && (
        <div className="mt-5 rounded-lg p-4" style={{ backgroundColor: TINT }}>
          <p className="text-[9pt] font-bold uppercase" style={{ color: ACCENT, letterSpacing: "0.06em" }}>
            Objetivo
          </p>
          <p className="mt-1" style={{ color: INK }}>
            {resume.objective || resume.professionalSummary}
          </p>
        </div>
      )}

      {resume.education.length > 0 && (
        <section>
          <Heading>Formação</Heading>
          <div className="flex flex-col gap-2.5">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold" style={{ color: INK }}>
                    {edu.course}
                  </span>
                  <span className="text-[8.5pt]" style={{ color: MUTED }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[9pt]" style={{ color: MUTED }}>
                  {edu.institution} {edu.level ? `· ${edu.level}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.courses) && (
        <section>
          <Heading>Cursos</Heading>
          <div className="flex flex-wrap gap-1.5">
            {resume.courses.items.map((c) => (
              <span
                key={c.id}
                className="rounded-full px-2.5 py-1 text-[8.5pt]"
                style={{ backgroundColor: TINT, color: INK }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.skills) && (
        <section>
          <Heading>Habilidades</Heading>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.items.map((s) => (
              <span
                key={s.id}
                className="rounded-full px-2.5 py-1 text-[8.5pt]"
                style={{ backgroundColor: TINT, color: INK }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.projects) && (
        <section>
          <Heading>Projetos</Heading>
          <div className="flex flex-col gap-2.5">
            {resume.projects.items.map((proj) => (
              <div key={proj.id}>
                <span className="font-bold" style={{ color: INK }}>
                  {proj.name}
                </span>
                {hasText(proj.description) && <p style={{ color: INK }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-[8.5pt]" style={{ color: MUTED }}>
                    {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
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

      {hasItems(resume.volunteering) && (
        <section>
          <Heading>Voluntariado</Heading>
          <div className="flex flex-col gap-1.5">
            {resume.volunteering.items.map((v) => (
              <p key={v.id} style={{ color: INK }}>
                <span className="font-bold">{v.role}</span> — {v.organization}
              </p>
            ))}
          </div>
        </section>
      )}

      {resume.hasProfessionalExperience === true && resume.experiences.length > 0 && (
        <section>
          <Heading>Experiência</Heading>
          <div className="flex flex-col gap-3">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold" style={{ color: INK }}>
                    {exp.position} — {exp.company}
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
              </div>
            ))}
          </div>
        </section>
      )}

      {hasItems(resume.certifications) && (
        <section>
          <Heading>Certificações</Heading>
          <ul className="list-disc pl-5">
            {resume.certifications.items.map((c) => (
              <li key={c.id} style={{ color: INK }}>
                {c.name} {c.institution ? `— ${c.institution}` : ""}{" "}
                {c.date ? `(${formatMonthYear(c.date)})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasItems(resume.awards) && (
        <section>
          <Heading>Prêmios</Heading>
          <p style={{ color: INK }}>{resume.awards.items.map((a) => a.name).join(", ")}</p>
        </section>
      )}
    </TemplatePage>
  );
}
