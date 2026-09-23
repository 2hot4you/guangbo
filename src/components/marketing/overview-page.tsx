import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

export function OverviewPage({page}: {page: MarketingPage}) {
  const isAiOverview = page.path === "/ai";
  return (
    <>
      <PageHero hero={page.hero} />
      {page.sections.map((section) => (
        <SectionShell className={isAiOverview ? "overview-ai" : "overview-idc"} key={section.id} section={section}>
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
