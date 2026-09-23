import type {ReactNode} from "react";
import type {ContentSection} from "@/content";

interface SectionShellProps {
  section: ContentSection;
  children?: ReactNode;
  className?: string;
  highlightBody?: boolean;
}

export function SectionShell({section, children, className = "", highlightBody = false}: SectionShellProps) {
  return (
    <section aria-labelledby={`${section.id}-heading`} className={`marketing-section section-space ${className}`} id={section.id}>
      <div className="site-container">
        {section.eyebrow && <p className="mb-3 font-semibold text-accent">{section.eyebrow}</p>}
        <h2 className="marketing-section__title text-balance" id={`${section.id}-heading`}>{section.title}</h2>
        {section.body && <p className={`marketing-section__body mt-5 ${highlightBody ? "marketing-note" : ""}`}>{section.body}</p>}
        {children}
      </div>
    </section>
  );
}
