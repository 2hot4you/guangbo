import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

export function ModelPage({page}: {page: MarketingPage}) {
  return (
    <>
      <PageHero hero={page.hero} />
      {page.sections.map((section) => {
        const isSeries = section.id.includes("models");
        return (
          <SectionShell className={isSeries ? "model-series" : "model-guidance"} highlightBody={isSeries} key={section.id} section={section}>
            <ContentCards items={section.items} />
          </SectionShell>
        );
      })}
    </>
  );
}
