import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

export function CompanyPage({page}: {page: MarketingPage}) {
  return (
    <>
      <PageHero hero={page.hero} />
      {page.sections.map((section) => (
        <SectionShell className={section.id === "contact" ? "company-collaboration" : "company-facts"} key={section.id} section={section}>
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
