"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { generateId } from "@/lib/utils/id";
import { SectionCard } from "@/components/ui/SectionCard";
import { TextField } from "@/components/ui/TextField";
import { IconButton } from "@/components/ui/IconButton";
import { ListFieldSection } from "@/components/form/ListFieldSection";
import { Trash2 } from "lucide-react";

export function Step05CoursesCertifications() {
  const courses = useResumeStore((s) => s.resume.courses);
  const certifications = useResumeStore((s) => s.resume.certifications);
  const setListStatus = useResumeStore((s) => s.setListStatus);
  const addListItem = useResumeStore((s) => s.addListItem);
  const updateListItem = useResumeStore((s) => s.updateListItem);
  const removeListItem = useResumeStore((s) => s.removeListItem);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Cursos">
        <ListFieldSection
          title="Cursos livres"
          absentLabel="Não possuo cursos para adicionar"
          addLabel="Adicionar curso"
          emptyHint="Nenhum curso adicionado ainda."
          status={courses.status}
          items={courses.items}
          onToggleAbsent={(checked) =>
            setListStatus("courses", checked ? "not_available" : "not_provided")
          }
          onAdd={() =>
            addListItem("courses", {
              id: generateId(),
              name: "",
              institution: "",
              date: "",
            })
          }
          renderItem={(course) => (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <IconButton
                  icon={Trash2}
                  label="Remover curso"
                  variant="danger"
                  onClick={() => removeListItem("courses", course.id)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField
                  label="Nome do curso"
                  value={course.name}
                  onChange={(e) => updateListItem("courses", course.id, { name: e.target.value })}
                />
                <TextField
                  label="Instituição"
                  value={course.institution}
                  onChange={(e) =>
                    updateListItem("courses", course.id, { institution: e.target.value })
                  }
                />
                <TextField
                  label="Data"
                  type="month"
                  value={course.date}
                  onChange={(e) => updateListItem("courses", course.id, { date: e.target.value })}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Certificações">
        <ListFieldSection
          title="Certificações"
          absentLabel="Não possuo certificações"
          addLabel="Adicionar certificação"
          emptyHint="Nenhuma certificação adicionada ainda."
          status={certifications.status}
          items={certifications.items}
          onToggleAbsent={(checked) =>
            setListStatus("certifications", checked ? "not_available" : "not_provided")
          }
          onAdd={() =>
            addListItem("certifications", {
              id: generateId(),
              name: "",
              institution: "",
              date: "",
            })
          }
          renderItem={(cert) => (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <IconButton
                  icon={Trash2}
                  label="Remover certificação"
                  variant="danger"
                  onClick={() => removeListItem("certifications", cert.id)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField
                  label="Nome"
                  value={cert.name}
                  onChange={(e) =>
                    updateListItem("certifications", cert.id, { name: e.target.value })
                  }
                />
                <TextField
                  label="Instituição"
                  value={cert.institution}
                  onChange={(e) =>
                    updateListItem("certifications", cert.id, { institution: e.target.value })
                  }
                />
                <TextField
                  label="Data"
                  type="month"
                  value={cert.date}
                  onChange={(e) =>
                    updateListItem("certifications", cert.id, { date: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
      </SectionCard>
    </div>
  );
}
