"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { TEMPLATE_REGISTRY } from "@/components/templates";
import { useScaleToFit } from "./useScaleToFit";

export function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const Template = TEMPLATE_REGISTRY[resume.settings.templateId];
  const { outerRef, innerRef, scale, height } = useScaleToFit<HTMLDivElement>();

  return (
    <div ref={outerRef} className="w-full overflow-hidden rounded-lg bg-bg p-4">
      <div className="relative" style={{ height }}>
        <div
          ref={innerRef}
          className="absolute left-1/2 top-0 origin-top shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.08)]"
          style={{ transform: `translateX(-50%) scale(${scale})` }}
        >
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}
