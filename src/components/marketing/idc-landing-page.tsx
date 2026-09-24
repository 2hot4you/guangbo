import Link from "next/link";
import type {ContentSection, MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail, VisualPlaceholder, styles} from "./landing-page-primitives";

function sectionFor(page: MarketingPage, id: string): ContentSection {
  const section = page.sections.find((entry) => entry.id === id);
  if (!section) throw new Error(`Missing IDC landing section: ${id}`);
  return section;
}

export function IdcLandingPage({page}: {page: MarketingPage}) {
  const services = sectionFor(page, "service-matrix");
  const workloads = sectionFor(page, "workload-map");
  const conditions = sectionFor(page, "deployment-conditions");
  const locations = sectionFor(page, "locations");
  const infrastructure = sectionFor(page, "infrastructure-stack");
  const scenarios = sectionFor(page, "scenarios");
  const migration = sectionFor(page, "migration");
  const delivery = sectionFor(page, "delivery");

  return (
    <div className="idc-landing min-w-0 overflow-x-clip" data-landing-page="idc">
      <LandingHero id="hero" eyebrow="IDC / 基础设施资源矩阵" title={page.hero.title} lead={page.hero.lead} tone="dark" layout="split">
        <div className="grid gap-5">
          <p className="border-t border-white/35 pt-5 font-mono text-xs leading-7 tracking-[0.15em] text-white/70 uppercase">
            Compute / Storage / Network / Power / Cooling
          </p>
          <VisualPlaceholder label="机柜与数据中心示意" description="机房项目图片待确认；示意不代表具体站点配置" />
        </div>
      </LandingHero>

      <LandingSection id={services.id} number="01" eyebrow="SERVICE MATRIX" title={services.title} body={services.body} tone="light">
        <div className="grid border-t border-black/25 md:grid-cols-2 xl:grid-cols-4">
          {services.items?.map((item, index) => (
            <article className="min-w-0 border-b border-black/25 px-0 py-8 md:border-r md:px-6 md:first:pl-0 xl:last:border-r-0" key={item.title}>
              <span className="mb-12 block font-mono text-xs text-black/65">RESOURCE / 0{index + 1}</span>
              <h3 className="mb-5 text-2xl font-semibold tracking-tight">
                {item.href ? <Link className={styles.textLink} href={item.href}>{item.title}</Link> : item.title}
              </h3>
              <p className="mb-8 leading-7 text-black/75">{item.body}</p>
              {item.meta && <p className="border-t border-black/20 pt-4 text-sm leading-6 text-black/60">选型重点：{item.meta}</p>}
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={workloads.id} number="02" eyebrow="WORKLOAD MAP" title={workloads.title} body={workloads.body} tone="muted">
        <figure aria-label="业务负载与资源匹配图" className="border-t border-black/30">
          <figcaption className="py-4 font-mono text-xs tracking-[0.12em] text-black/65 uppercase">业务负载 → 资源方向 → 方案核对</figcaption>
          <div className="grid gap-px bg-black/20 md:grid-cols-2">
            {workloads.items?.map((item, index) => (
              <article className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 bg-[var(--surface-secondary)] p-5 sm:p-7" key={item.title}>
                <span aria-hidden="true" className="font-mono text-xs text-black/65">0{index + 1}</span>
                <div>
                  <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                  <p className="leading-7 text-black/70">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </figure>
      </LandingSection>

      <LandingSection id={conditions.id} number="03" eyebrow="DEPLOYMENT CONDITIONS" title={conditions.title} body={conditions.body} tone="light">
        <NumberedList items={conditions.items ?? []} label="部署条件" />
      </LandingSection>

      <LandingSection id={locations.id} number="04" eyebrow="LOCATIONS" title={locations.title} body={locations.body} tone="dark">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <VisualPlaceholder label="地域与访问路径示意" description="资源节点和访问线路依项目实际条件确认" />
          <div className="border-t border-white/30">
            {locations.items?.map((item) => (
              <article className="border-b border-white/25 py-5" key={item.title}>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="leading-7 text-white/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection id={infrastructure.id} number="05" eyebrow="INFRASTRUCTURE STACK" title={infrastructure.title} body={infrastructure.body} tone="accent">
        <ol aria-label="五层基础设施条件" className="border-t border-black/35">
          {infrastructure.items?.map((item, index) => (
            <li className="grid gap-4 border-b border-black/35 py-5 md:grid-cols-[3rem_minmax(10rem,0.55fr)_minmax(0,1fr)] md:items-center md:gap-8" key={item.title}>
              <span aria-hidden="true" className="font-mono text-xs">0{index + 1}</span>
              <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="leading-7 text-black/75">{item.body}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection id={scenarios.id} number="06" eyebrow="SCENARIOS" title={scenarios.title} body={scenarios.body} tone="light">
        <div className="grid gap-px border border-black/20 bg-black/20 sm:grid-cols-2">
          {scenarios.items?.map((item, index) => (
            <article className="min-w-0 bg-[var(--background)] p-6 sm:p-8" key={item.title}>
              <span className="mb-10 block font-mono text-xs text-black/65">CASE / 0{index + 1}</span>
              <h3 className="mb-4 text-2xl font-semibold">{item.title}</h3>
              <p className="leading-7 text-black/70">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={migration.id} number="07" eyebrow="MIGRATION" title={migration.title} body={migration.body} tone="muted">
        <ProcessRail items={migration.items ?? []} label="迁移与扩容步骤" />
      </LandingSection>

      <LandingSection id={delivery.id} number="08" eyebrow="DELIVERY" title={delivery.title} body={delivery.body} tone="dark">
        <div className="grid gap-5 md:grid-cols-2">
          {delivery.items?.map((item, index) => (
            <article className="border-t border-white/40 pt-5" key={item.title}>
              <span className="mb-7 block font-mono text-xs text-[#d9ff43]">CHECK / 0{index + 1}</span>
              <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
              <p className="leading-7 text-white/70">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>
    </div>
  );
}
