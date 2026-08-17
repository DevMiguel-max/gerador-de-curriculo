"use client";

import { Trash2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { generateId } from "@/lib/utils/id";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { IconButton } from "@/components/ui/IconButton";
import { ListFieldSection } from "@/components/form/ListFieldSection";

export function Step08Projects() {
  const projects = useResumeStore((s) => s.resume.projects);
  const volunteering = useResumeStore((s) => s.resume.volunteering);
  const awards = useResumeStore((s) => s.resume.awards);
  const setListStatus = useResumeStore((s) => s.setListStatus);
  const addListItem = useResumeStore((s) => s.addListItem);
  const updateListItem = useResumeStore((s) => s.updateListItem);
  const removeListItem = useResumeStore((s) => s.removeListItem);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Projetos"
        description="Especialmente importante para quem está começando na área ou muda de carreira."
      >
        <ListFieldSection
          title="Projetos"
          absentLabel="Não possuo projetos para adicionar"
          addLabel="Adicionar projeto"
          emptyHint="Nenhum projeto adicionado ainda."
          status={projects.status}
          items={projects.items}
          onToggleAbsent={(checked) =>
            setListStatus("projects", checked ? "not_available" : "not_provided")
          }
          onAdd={() =>
            addListItem("projects", {
              id: generateId(),
              name: "",
              description: "",
              technologies: [],
            })
          }
          renderItem={(project) => (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <IconButton
                  icon={Trash2}
                  label="Remover projeto"
                  variant="danger"
                  onClick={() => removeListItem("projects", project.id)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Nome do projeto"
                  value={project.name}
                  onChange={(e) =>
                    updateListItem("projects", project.id, { name: e.target.value })
                  }
                />
                <TextField
                  label="Período"
                  value={project.period ?? ""}
                  onChange={(e) =>
                    updateListItem("projects", project.id, { period: e.target.value })
                  }
                  optional
                />
              </div>
              <TextArea
                label="Descrição"
                value={project.description}
                onChange={(e) =>
                  updateListItem("projects", project.id, { description: e.target.value })
                }
              />
              <TextField
                label="Tecnologias"
                value={project.technologies.join(", ")}
                onChange={(e) =>
                  updateListItem("projects", project.id, {
                    technologies: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                hint="Separadas por vírgula."
                optional
              />
              <TextField
                label="URL"
                value={project.url ?? ""}
                onChange={(e) => updateListItem("projects", project.id, { url: e.target.value })}
                optional
              />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Voluntariado">
        <ListFieldSection
          title="Trabalho voluntário"
          absentLabel="Não possuo trabalho voluntário"
          addLabel="Adicionar voluntariado"
          emptyHint="Nenhum voluntariado adicionado ainda."
          status={volunteering.status}
          items={volunteering.items}
          onToggleAbsent={(checked) =>
            setListStatus("volunteering", checked ? "not_available" : "not_provided")
          }
          onAdd={() =>
            addListItem("volunteering", {
              id: generateId(),
              organization: "",
              role: "",
              period: "",
            })
          }
          renderItem={(vol) => (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <IconButton
                  icon={Trash2}
                  label="Remover voluntariado"
                  variant="danger"
                  onClick={() => removeListItem("volunteering", vol.id)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField
                  label="Organização"
                  value={vol.organization}
                  onChange={(e) =>
                    updateListItem("volunteering", vol.id, { organization: e.target.value })
                  }
                />
                <TextField
                  label="Função"
                  value={vol.role}
                  onChange={(e) =>
                    updateListItem("volunteering", vol.id, { role: e.target.value })
                  }
                />
                <TextField
                  label="Período"
                  value={vol.period}
                  onChange={(e) =>
                    updateListItem("volunteering", vol.id, { period: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Prêmios e conquistas">
        <ListFieldSection
          title="Prêmios e conquistas"
          absentLabel="Não possuo prêmios para adicionar"
          addLabel="Adicionar prêmio"
          emptyHint="Nenhum prêmio adicionado ainda."
          status={awards.status}
          items={awards.items}
          onToggleAbsent={(checked) =>
            setListStatus("awards", checked ? "not_available" : "not_provided")
          }
          onAdd={() =>
            addListItem("awards", { id: generateId(), name: "", institution: "", date: "" })
          }
          renderItem={(award) => (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <IconButton
                  icon={Trash2}
                  label="Remover prêmio"
                  variant="danger"
                  onClick={() => removeListItem("awards", award.id)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField
                  label="Nome"
                  value={award.name}
                  onChange={(e) => updateListItem("awards", award.id, { name: e.target.value })}
                />
                <TextField
                  label="Instituição"
                  value={award.institution}
                  onChange={(e) =>
                    updateListItem("awards", award.id, { institution: e.target.value })
                  }
                />
                <TextField
                  label="Data"
                  type="month"
                  value={award.date}
                  onChange={(e) => updateListItem("awards", award.id, { date: e.target.value })}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>
    </div>
  );
}
