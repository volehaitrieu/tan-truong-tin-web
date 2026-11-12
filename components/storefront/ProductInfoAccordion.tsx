"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Section = { title: string; content: ReactNode };

export function ProductInfoAccordion({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-line">
      {sections.map((section, index) => {
        const open = active === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <section key={section.title}>
            <h2>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(open ? null : index)}
                className="flex min-h-16 w-full items-center justify-between gap-3 py-4 text-left text-[17px] font-bold text-ink transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {section.title}
                <ChevronRight className={`size-4 shrink-0 text-brand transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`} aria-hidden="true" />
              </button>
            </h2>
            <div id={panelId} aria-hidden={!open} inert={!open} className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="min-h-0 overflow-hidden">
                <div className="pb-5 text-[15px] leading-6 text-ink-2">{section.content}</div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
