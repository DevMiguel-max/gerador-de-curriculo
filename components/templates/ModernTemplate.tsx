import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";
import type { TemplateProps } from "@/components/templates/types";
import { TemplatePage } from "@/components/templates/shared/TemplatePage";
import { hasItems, hasText, hasValue } from "@/lib/utils/fieldState";
import { formatDateRange, formatMonthYear } from "@/lib/utils/date";

const ACCENT = "#1F4B99";
const INK = "#1E293B";
const MUTED = "#5B6472";

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "básico",
  intermediate: "intermediário",
  advanced: "avançado",
  fluent: "fluente",
  native: "nativo",
};

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-2 mt-6 text-[9pt] font-bold uppercase first:mt-0"
      style={{ color: ACCENT, letterSpacing: "0.08em" }}
    >
      {children}
    </h2>
  );
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-2 mt-5 flex items-center gap-2 text-[11pt] font-bold uppercase first:mt-0"
      style={{ color: ACCENT, letterSpacing: "0.04em" }}
    >
      <span className="h-[3px] w-4 rounded-full" style={{ backgroundColor: ACCENT }} />
      {children}
    </h2>
  );
}

export function ModernTemplate({ resume }: TemplateProps) {
  const { personalInfo: p } = resume;
  const hasPhoto = hasValue(p.photo);

  return (
    <TemplatePage>
      <header className="flex items-center gap-4 px-[16mm] py-[12mm]" style={{ backgroundColor: ACCENT }}>
        {hasPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.photo.value as string}
            alt=""
            className="h-[22mm] w-[22mm] shrink-0 rounded-full border-2 border-white object-cover"
          />
        )}
        <div>
          <h1 className="text-[19pt] font-bold text-white">{p.fullName || "Seu nome"}</h1>
          {p.professionalTitle && (
            <p className="mt-0.5 text-[10.5pt] text-white/85">{p.professionalTitle}</p>
          )}
        </div>
      </header>

      <div className="flex">
        <aside className="w-[62mm] px-[10mm] py-[8mm]" style={{ backgroundColor: "#F0F3F9" }}>
          <SidebarHeading>Contato</SidebarHeading>
          <div className="flex flex-col gap-1.5 text-[9pt]" style={{ color: INK }}>
            {p.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0" style={{ color: ACCENT }} /> {p.email}
              </span>
            )}
            {p.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 shrink-0" style={{ color: ACCENT }} /> {p.phone}
              </span>
            )}
            {(p.city || p.stateProvince) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" style={{ color: ACCENT }} />
                {[p.city, p.stateProvince].filter(Boolean).join(", ")}
              </span>
            )}
            {[
              hasValue(p.linkedin) ? p.linkedin.value : null,
              hasValue(p.github) ? p.github.value : null,
              hasValue(p.portfolio) ? p.portfolio.value : null,
              hasValue(p.website) ? p.website.value : null,
            ]
              .filter(Boolean)
              .map((link) => (
                <span key={link} className="flex items-center gap-1.5 break-all">
                  <LinkIcon className="h-3 w-3 shrink-0" style={{ color: ACCENT }} /> {link}
                </span>
              ))}
          </div>

          {hasItems(resume.skills) && (
            <>
              <SidebarHeading>Habilidades</SidebarHeading>
              <ul className="flex flex-col gap-1 text-[9pt]" style={{ color: INK }}>
                {resume.skills.items.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </>
          )}

          {hasItems(resume.languages) && (
            <>
              <SidebarHeading>Idiomas</SidebarHeading>
              <ul className="flex flex-col gap-1 text-[9pt]" style={{ color: INK }}>
                {resume.languages.items.map((l) => (
                  <li key={l.id}>
                    {l.language} — {PROFICIENCY_LABEL[l.proficiency]}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <main className="flex-1 px-[10mm] py-[8mm]">
          {hasText(resume.professionalSummary) && (
            <section>
              <MainHeading>Perfil</MainHeading>
              <p style={{ color: INK }}>{resume.professionalSummary}</p>
            </section>
          )}

          {resume.hasProfessionalExperience === true && resume.experiences.length > 0 && (
            <section>
              <MainHeading>Experiência</MainHeading>
              <div className="flex flex-col gap-3">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold" style={{ color: INK }}>
                        {exp.position}
                      </span>
                      <span className="text-[8.5pt]" style={{ color: MUTED }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="text-[9pt] font-medium" style={{ color: ACCENT }}>
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {hasText(exp.description) && (
                      <p className="mt-1" style={{ color: INK }}>
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements.filter(hasText).length > 0 && (
                      <ul className="mt-1 list-disc pl-4">
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
              <MainHeading>Formação</MainHeading>
              <div className="flex flex-col gap-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex items-baseline justify-between">
                    <span style={{ color: INK }}>
                      <span className="font-bold">{edu.course}</span>
                      {edu.institution ? ` — ${edu.institution}` : ""}
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
              <MainHeading>Projetos</MainHeading>
              <div className="flex flex-col gap-2">
                {resume.projects.items.map((proj) => (
                  <div key={proj.id}>
                    <span className="font-bold" style={{ color: INK }}>
                      {proj.name}
                    </span>
                    {hasText(proj.description) && <p style={{ color: INK }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasItems(resume.courses) && (
            <section>
              <MainHeading>Cursos</MainHeading>
              <ul className="list-disc pl-4">
                {resume.courses.items.map((c) => (
                  <li key={c.id} style={{ color: INK }}>
                    {c.name} {c.institution ? `— ${c.institution}` : ""}{" "}
                    {c.date ? `(${formatMonthYear(c.date)})` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasItems(resume.certifications) && (
            <section>
              <MainHeading>Certificações</MainHeading>
              <ul className="list-disc pl-4">
                {resume.certifications.items.map((c) => (
                  <li key={c.id} style={{ color: INK }}>
                    {c.name} {c.institution ? `— ${c.institution}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </TemplatePage>
  );
}
