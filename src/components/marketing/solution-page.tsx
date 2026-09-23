import type {MarketingPage} from "@/content";
import {ContentCards} from "./content-card";
import {PageHero} from "./page-hero";
import {SectionShell} from "./section-shell";

function NetworkTopology() {
  return (
    <figure aria-labelledby="network-topology-caption" className="network-topology mt-8">
      <figcaption className="font-semibold" id="network-topology-caption">站点连接结构</figcaption>
      <ol aria-label="站点连接路径" className="network-topology__path mt-5">
        <li className="network-topology__station">客户站点</li>
        <li className="network-topology__connection">本地接入</li>
        <li className="network-topology__station">区域汇聚资源</li>
        <li className="network-topology__connection">骨干传输</li>
        <li className="network-topology__station">目标区域与站点</li>
      </ol>
    </figure>
  );
}

export function SolutionPage({page}: {page: MarketingPage}) {
  return (
    <>
      <PageHero hero={page.hero} />
      {page.sections.map((section) => (
        <SectionShell className={section.id === "delivery" ? "solution-delivery" : "solution-detail"} key={section.id} section={section}>
          {page.path === "/network" && section.id === "topology" && <NetworkTopology />}
          <ContentCards items={section.items} />
        </SectionShell>
      ))}
    </>
  );
}
