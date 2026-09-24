import Link from "next/link";
import type {ContentSection, MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail, styles} from "./landing-page-primitives";

function sectionFor(page: MarketingPage, id: string): ContentSection {
  const section = page.sections.find((entry) => entry.id === id);
  if (!section) throw new Error(`Missing AI landing section: ${id}`);
  return section;
}

export function AiLandingPage({page}: {page: MarketingPage}) {
  const capability = sectionFor(page, "capability-map");
  const ecosystem = sectionFor(page, "ecosystem");
  const workflows = sectionFor(page, "workflows");
  const scenarios = sectionFor(page, "scenarios");
  const selection = sectionFor(page, "selection");
  const integration = sectionFor(page, "integration");
  const governance = sectionFor(page, "governance");
  const availability = sectionFor(page, "availability");

  return (
    <div className="ai-landing min-w-0 overflow-x-clip" data-landing-page="ai">
      <LandingHero id="hero" eyebrow="AI / 模型生态编辑部" title={page.hero.title} lead={page.hero.lead} tone="light" className="relative border-b border-black/15">
        <figure aria-label="模型能力轨道图" className="mt-14 grid gap-5 border-t border-black/20 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-center">
          <figcaption className="max-w-xl text-sm leading-7 text-black/65">
            <span className="mb-3 block font-mono text-xs tracking-[0.2em] uppercase">INPUT → MODEL → OUTPUT</span>
            以真实任务为中心，沿语言理解、图像创作和视频表达三条轨道寻找可验证的能力。
          </figcaption>
          <div aria-hidden="true" className="relative mx-auto grid aspect-square w-[min(100%,22rem)] place-items-center rounded-full border border-black/25 bg-[#d9ff43]">
            <div className="absolute inset-[13%] rounded-full border border-black/35" />
            <div className="absolute inset-[29%] rounded-full border border-black/35" />
            <span className="z-10 grid size-24 place-items-center rounded-full bg-black text-center font-mono text-xs font-bold tracking-[0.18em] text-white">TASK<br />FIRST</span>
            <span className="absolute top-[8%] left-[42%] rounded-full bg-black px-3 py-1 font-mono text-xs text-white">LLM</span>
            <span className="absolute right-[2%] bottom-[28%] rounded-full bg-black px-3 py-1 font-mono text-xs text-white">IMAGE</span>
            <span className="absolute bottom-[8%] left-[9%] rounded-full bg-black px-3 py-1 font-mono text-xs text-white">VIDEO</span>
          </div>
        </figure>
      </LandingHero>

      <LandingSection id={capability.id} number="01" eyebrow="CAPABILITY MAP" title={capability.title} body={capability.body} tone="muted">
        <div className="border-t border-black/30">
          {capability.items?.map((item, index) => (
            <article className="grid gap-3 border-b border-black/25 py-7 md:grid-cols-[5rem_minmax(12rem,0.8fr)_minmax(0,1fr)] md:gap-8 md:py-10" key={item.title}>
              <span aria-hidden="true" className="font-mono text-xs text-black/55">0{index + 1}</span>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {item.href ? <Link className="underline decoration-[#b6e825] decoration-4 underline-offset-6 hover:decoration-black focus-visible:outline-2" href={item.href}>{item.title}</Link> : item.title}
              </h3>
              <p className="max-w-2xl leading-8 text-black/70">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={ecosystem.id} number="02" eyebrow="MODEL ECOSYSTEM" title={ecosystem.title} body={ecosystem.body} tone="dark">
        <div className="grid gap-px overflow-hidden border border-white/25 bg-white/25 md:grid-cols-2">
          {ecosystem.items?.map((item, index) => (
            <article className="min-w-0 bg-[#080808] p-6 sm:p-9" key={item.title}>
              <span className="mb-12 block font-mono text-xs text-[#d9ff43]">FAMILY / 0{index + 1}</span>
              <h3 className="mb-5 text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="leading-8 text-white/70">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={workflows.id} number="03" eyebrow="WORKFLOW" title={workflows.title} body={workflows.body} tone="light">
        <ProcessRail items={workflows.items ?? []} label="模型任务工作流" />
      </LandingSection>

      <LandingSection id={scenarios.id} number="04" eyebrow="SCENARIOS" title={scenarios.title} body={scenarios.body} tone="accent">
        <div className="grid border-t border-black/30 md:grid-cols-2 xl:grid-cols-4">
          {scenarios.items?.map((item, index) => (
            <article className="min-w-0 border-b border-black/30 py-8 md:border-r md:px-6 md:first:pl-0 xl:last:border-r-0" key={item.title}>
              <span className="mb-10 block font-mono text-xs">USE / 0{index + 1}</span>
              <h3 className="mb-5 text-2xl font-semibold tracking-tight">{item.title}</h3>
              <p className="leading-7 text-black/75">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={selection.id} number="05" eyebrow="SELECTION" title={selection.title} body={selection.body} tone="muted">
        <NumberedList items={selection.items ?? []} label="模型选型维度" />
      </LandingSection>

      <LandingSection id={integration.id} number="06" eyebrow="INTEGRATION" title={integration.title} body={integration.body} tone="light">
        <ProcessRail items={integration.items ?? []} label="模型接入路径" />
      </LandingSection>

      <LandingSection id={governance.id} number="07" eyebrow="GOVERNANCE" title={governance.title} body={governance.body} tone="dark">
        <div className="grid gap-4 sm:grid-cols-2">
          {governance.items?.map((item, index) => (
            <article className="border-t border-white/45 py-6" key={item.title}>
              <span className="mb-8 block font-mono text-xs text-[#d9ff43]">0{index + 1} / CHECK</span>
              <h3 className="mb-4 text-2xl font-semibold">{item.title}</h3>
              <p className="max-w-xl leading-7 text-white/70">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={availability.id} number="08" eyebrow="AVAILABILITY" title={availability.title} body={availability.body} tone="light">
        <div className="grid gap-4 border-t border-black/25 pt-8 md:grid-cols-3">
          {availability.items?.map((item) => (
            <article className="border-l-4 border-[#c9fa3c] pl-5" key={item.title}>
              <h3 className="text-lg font-semibold">
                {item.href ? <Link className={styles.textLink} href={item.href}>{item.title}</Link> : item.title}
              </h3>
              <p className="mt-3 leading-7 text-black/65">{item.body}</p>
            </article>
          ))}
        </div>
      </LandingSection>
    </div>
  );
}
