import type {ReactNode} from "react";
import Link from "next/link";
import type {PublicPath} from "@/content";
import styles from "./landing-pages.module.css";

export {styles};

type LandingTone = "light" | "muted" | "dark" | "accent";

interface LandingHeroProps {
  id: string;
  title: string;
  lead: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  tone?: LandingTone;
  layout?: "stacked" | "split";
  visualPosition?: "start" | "end";
  compact?: boolean;
}

interface LandingSectionProps {
  id: string;
  title: string;
  body?: ReactNode;
  eyebrow?: string;
  number?: string;
  children?: ReactNode;
  className?: string;
  tone?: LandingTone;
}

interface VisualPlaceholderProps {
  label: string;
  description?: string;
  className?: string;
}

interface ListItem {
  title: string;
  body?: string;
  href?: PublicPath;
}

interface ListProps {
  items: readonly ListItem[];
  className?: string;
  label?: string;
}

const toneClass: Record<LandingTone, string> = {
  light: styles.toneLight,
  muted: styles.toneMuted,
  dark: styles.toneDark,
  accent: styles.toneAccent,
};

export function LandingHero({id, title, lead, eyebrow, children, className = "", tone = "light", layout = "stacked", visualPosition = "end", compact = false}: LandingHeroProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={`${styles.hero} ${toneClass[tone]} ${compact ? styles.heroCompact : ""} ${className}`} data-content-module data-tone={tone} id={id}>
      <div className={`${styles.container} ${layout === "split" ? styles.heroSplit : ""} ${layout === "split" && visualPosition === "start" ? styles.heroSplitVisualStart : ""}`}>
        <div className={styles.heroCopy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.heroTitle} id={`${id}-heading`}>{title}</h1>
          <p className={styles.heroLead}>{lead}</p>
        </div>
        {children && <div className={styles.heroVisual}>{children}</div>}
      </div>
    </section>
  );
}

export function LandingSection({id, title, body, eyebrow, number, children, className = "", tone = "light"}: LandingSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={`${styles.section} ${toneClass[tone]} ${className}`} data-content-module data-tone={tone} id={id}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          {(number || eyebrow) && <p className={styles.eyebrow}>{[number, eyebrow].filter(Boolean).join(" / ")}</p>}
          <h2 className={styles.sectionTitle} id={`${id}-heading`}>{title}</h2>
          {body && <div className={styles.sectionBody}>{body}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function VisualPlaceholder({label, description, className = ""}: VisualPlaceholderProps) {
  return (
    <figure aria-label={label} className={`${styles.placeholder} ${className}`}>
      <div aria-hidden="true" className={styles.placeholderArt} />
      <figcaption className={styles.placeholderCaption}>
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </figcaption>
    </figure>
  );
}

export function NumberedList({items, className = "", label}: ListProps) {
  return (
    <ol aria-label={label} className={`${styles.numberedList} ${className}`}>
      {items.map((item, index) => (
        <li className={styles.numberedItem} key={`${index}-${item.title}`}>
          <span aria-hidden="true" className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.numberedCopy}>
            <h3>{item.href ? <Link className={styles.textLink} href={item.href}>{item.title}</Link> : item.title}</h3>
            {item.body && <p>{item.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProcessRail({items, className = "", label}: ListProps) {
  return (
    <ol aria-label={label} className={`${styles.processRail} ${className}`}>
      {items.map((item, index) => (
        <li className={styles.processStep} key={`${index}-${item.title}`}>
          <span aria-hidden="true" className={styles.processNumber}>{String(index + 1).padStart(2, "0")}</span>
          <h3>{item.href ? <Link className={styles.textLink} href={item.href}>{item.title}</Link> : item.title}</h3>
          {item.body && <p>{item.body}</p>}
        </li>
      ))}
    </ol>
  );
}
