import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const NAVY = "#1B2733";
const BURGUNDY = "#7A2E3A";
const INK = "#242424";
const MUTED = "#6B6B6B";

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
      className="mb-2 mt-6 flex items-center gap-3 text-[10.5pt] font-bold uppercase first:mt-0"
      style={{ color: NAVY, letterSpacing: "0.08em" }}
    >
      {children}
      <span className="h-px flex-1" style={{ backgroundColor: BURGUNDY }} />
    </h2>
  );
}

export function ExecutiveTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;

  const contact = [
    p.email,
    p.phone,
    [p.city, p.stateProvince].filter(Boolean).join(", "),
    hasValue(p.linkedin) ? p.linkedin.value : null,
  ].filter(Boolean);

  return (
    <TemplatePage>
      <header className="px-[18mm] py-[14mm]" style={{ backgroundColor: NAVY }}>
        <h1
          className="text-[22pt] text-white"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {p.fullName || "Seu nome"}
        </h1>
        {p.professionalTitle && (
          <p className="mt-1 text-[11pt]" style={{ color: "#D8B9A6" }}>
            {p.professionalTitle}
          </p>
        )}
        {contact.length > 0 && (
          <p className="mt-3 text-[8.5pt] text-white/70">{contact.join("   ·   ")}</p>
        )}
      </header>

      <div className="px-[18mm] py-[10mm]">
        {hasText(resume.professionalSummary) && (
          <section>
            <Heading>Perfil executivo</Heading>
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
                    <span className="text-[10.5pt] font-bold" style={{ color: NAVY }}>
                      {exp.position}
                    </span>
                    <span className="text-[9pt] font-medium" style={{ color: BURGUNDY }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-[9.5pt] italic" style={{ color: MUTED }}>
                    {exp.company}
                    {exp.location ? ` — ${exp.location}` : ""}
                  </p>
                  {hasText(exp.description) && (
                    <p className="mt-1.5" style={{ color: INK }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.filter(hasText).length > 0 && (
                    <ul className="mt-1.5 list-disc pl-5">
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
                  </span>
                  <span className="text-[9pt] font-medium" style={{ color: BURGUNDY }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-x-10">
          {hasItems(resume.skills) && (
            <section>
              <Heading>Competências</Heading>
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
        </div>

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
            <Heading>Prêmios e conquistas</Heading>
            <ul className="list-disc pl-5">
              {resume.awards.items.map((a) => (
                <li key={a.id} style={{ color: INK }}>
                  {a.name} {a.institution ? `— ${a.institution}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </TemplatePage>
  );
}
