import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

export function SolutionPage({page}: {page: MarketingPage}) {
  return (
    <>
      <PageHero hero={page.hero} />
      {page.sections.map((section) => (
        <SectionShell className={section.id === "delivery" ? "solution-delivery" : "solution-detail"} key={section.id} section={section}>
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
