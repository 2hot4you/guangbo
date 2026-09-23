import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

export function HomePage({page}: {page: MarketingPage}) {
  return (
    <>
      <PageHero hero={page.hero} showCapabilityVisual />
      {page.sections.map((section) => (
        <SectionShell className={section.id === "ai" ? "home-capabilities" : ""} highlightBody={section.id === "model-ecosystem"} key={section.id} section={section}>
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
