import Link from "next/link";
import {getPageByPath} from "@/content";
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
          {section.id === "about" && (
            <div className="home-company-intro mt-8">
              <p>{getPageByPath("/about").hero.lead}</p>
              <Link className="link mt-4 inline-flex font-semibold text-link" href="/about">了解光波互联</Link>
            </div>
          )}
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
