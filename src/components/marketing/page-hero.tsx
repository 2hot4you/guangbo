import Link from "next/link";
import type {MarketingPage, PublicPath} from "@/content";

interface PageHeroProps {
  hero: MarketingPage["hero"];
  cta?: {label: string; href: PublicPath};
  showCapabilityVisual?: boolean;
}

export function PageHero({hero, cta, showCapabilityVisual = false}: PageHeroProps) {
  return (
    <div className="marketing-hero section-space">
      <div className={`site-container ${showCapabilityVisual ? "marketing-hero__layout" : ""}`}>
        <div>
          <h1 className="marketing-hero__title text-balance">{hero.title}</h1>
          <p className="marketing-hero__lead mt-6">{hero.lead}</p>
          {cta && <Link className="button button--primary mt-8 inline-flex" href={cta.href}>{cta.label}</Link>}
        </div>
        {showCapabilityVisual && (
          <div aria-hidden="true" className="capability-visual">
            <span>LLM</span><span>图像</span><span>视频</span>
          </div>
        )}
      </div>
    </div>
  );
}
