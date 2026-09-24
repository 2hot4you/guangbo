import type {MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail, VisualPlaceholder} from "./landing-page-primitives";

export function AboutLandingPage({page}: {page: MarketingPage}) {
  const [identity, businessMap, approach, practice, ecosystem, principles, delivery, contact] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="about-hero" eyebrow="ABOUT / GUANGBO" title={page.hero.title} lead={page.hero.lead} tone="light">
        <div className="mt-12 max-w-4xl"><VisualPlaceholder label="公司形象视觉占位" description="公司图片尚待确认" /></div>
      </LandingHero>

      <LandingSection id={identity.id} title={identity.title} body={identity.body} number="01" tone="dark">
        <p className="border-t border-white/30 pt-7 text-[clamp(4rem,13vw,11rem)] font-semibold leading-none tracking-[-0.08em] text-lime-300">2019</p>
      </LandingSection>

      <LandingSection id={businessMap.id} title={businessMap.title} body={businessMap.body} number="02" tone="muted">
        <figure aria-label="公司业务版图" className="company-story border-y border-current/20 py-7">
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-5">
            {["模型", "算力", "网络", "系统", "能源"].map((domain, index) => (
              <li className="border-l border-current/30 py-3 pl-4" key={domain}>
                <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
                <h3 className="mt-8 text-2xl font-semibold">{domain}</h3>
              </li>
            ))}
          </ol>
          <figcaption className="mt-7 text-sm opacity-60">业务方向可按项目需求组合评估，资源归属以具体方案为准。</figcaption>
        </figure>
        <div className="mt-10"><NumberedList label="业务版图说明" items={businessMap.items ?? []} /></div>
      </LandingSection>

      <LandingSection id={approach.id} title={approach.title} body={approach.body} number="03">
        <blockquote className="max-w-4xl border-l-4 border-lime-500 pl-6 text-[clamp(1.6rem,3vw,3rem)] leading-tight tracking-tight">先理解业务场景，再讨论资源与配置。</blockquote>
      </LandingSection>

      <LandingSection id={practice.id} title={practice.title} number="04" tone="accent">
        <ol aria-label="业务实践方向" className="m-0 list-none border-t border-current/30 p-0">
          {practice.items?.map((item, index) => (
            <li className="grid gap-3 border-b border-current/30 py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,2fr)]" key={item.title}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span><h3 className="text-2xl font-semibold">{item.title}</h3><p className="leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection id={ecosystem.id} title={ecosystem.title} body={ecosystem.body} number="05" tone="dark">
        <div className="grid gap-8 border-t border-white/30 pt-7 md:grid-cols-2">
          <div><h3 className="text-xl font-semibold text-lime-300">合作生态</h3><p className="mt-3 text-white/70">连接适用的合作资源与实施能力。</p></div>
          <div><h3 className="text-xl font-semibold text-lime-300">项目责任</h3><p className="mt-3 text-white/70">按项目确认资源、实施主体与交付分工。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={principles.id} title={principles.title} body={principles.body} number="06">
        <div className="grid border-y border-current/20 md:grid-cols-3">
          {["清晰", "可验证", "可扩展"].map((word) => (
            <p className="border-b border-current/20 py-8 text-3xl font-semibold last:border-b-0 md:border-b-0 md:border-r md:px-5 first:md:pl-0 last:md:border-r-0" key={word}>{word}</p>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={delivery.id} title={delivery.title} body={delivery.body} number="07" tone="muted">
        <ProcessRail label="公司协作交付流程" items={[
          {title: "需求", body: "沟通业务目标。"},
          {title: "匹配", body: "核对可用资源。"},
          {title: "确认", body: "明确配置与分工。"},
          {title: "交接", body: "说明实施安排。"},
          {title: "验收", body: "核对约定内容。"},
        ]} />
      </LandingSection>

      <LandingSection id={contact.id} title={contact.title} body={contact.body} number="08" tone="dark">
        <p className="max-w-3xl border-t border-white/30 pt-7 text-sm leading-relaxed text-white/65">待公开联系方式经核实后，再提供可用的联系入口。</p>
      </LandingSection>
    </div>
  );
}
