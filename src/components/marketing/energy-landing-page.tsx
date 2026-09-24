import type {MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail, VisualPlaceholder} from "./landing-page-primitives";

export function EnergyLandingPage({page}: {page: MarketingPage}) {
  const [inputs, greenPower, purchase, management, projects, carbon, scenarios, delivery] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="energy-hero" eyebrow="ENERGY / ENTERPRISE PATH" title={page.hero.title} lead={page.hero.lead} tone="accent" compact>
        <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <figure aria-label="首屏企业用能路径" className="min-w-0 border-y border-current/35 py-3">
            <ol aria-label="首屏用能路径" className="m-0 grid list-none grid-cols-2 gap-3 p-0">
              {["用能起点", "需求分析", "方案对接", "项目评估"].map((title, index) => (
                <li className="flex min-w-0 items-baseline gap-2 border-l-2 border-current/50 py-2 pl-3" key={title}>
                  <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
                  <strong className="text-base">{title}</strong>
                </li>
              ))}
            </ol>
            <figcaption className="mt-3 text-sm opacity-70">用能路径示意：从企业数据到可行性沟通。</figcaption>
          </figure>
          <VisualPlaceholder label="清洁能源项目视觉占位" description="项目图片尚待确认" />
        </div>
      </LandingHero>

      <LandingSection id={inputs.id} title={inputs.title} body={inputs.body} number="01">
        <figure aria-label="企业用能输入资料" className="energy-flow border-y border-current/20 py-7">
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-4">
            {[
              ["所在地区", "提供用能位置与场地条件，明确讨论的项目范围。"],
              ["用电规模", "汇总用电数据与现有采购安排，说明需求规模。"],
              ["历史负荷", "准备负荷曲线和生产计划，梳理用电变化。"],
              ["绿色用能目标", "说明绿电、绿证或节能项目方向，明确评估重点。"],
            ].map(([title, detail], index) => (
              <li className="min-w-0 border-l-2 border-lime-500 py-3 pl-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-5" key={title}>
                <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm opacity-65">{detail}</p>
              </li>
            ))}
          </ol>
          <figcaption className="mt-7 text-sm opacity-65">输入资料：先梳理四项起点，再结合企业数据与项目条件沟通。</figcaption>
        </figure>
      </LandingSection>

      <LandingSection id={greenPower.id} title={greenPower.title} body={greenPower.body} number="02" tone="dark">
        <div className="grid gap-8 border-t border-white/30 pt-7 md:grid-cols-2">
          <div><span className="font-mono text-xs text-lime-300">PATH A</span><h3 className="mt-3 text-2xl">绿电需求</h3><p className="mt-3 leading-relaxed text-white/70">确认采购周期、需求规模与适用服务方案。</p></div>
          <div><span className="font-mono text-xs text-lime-300">PATH B</span><h3 className="mt-3 text-2xl">绿证需求</h3><p className="mt-3 leading-relaxed text-white/70">梳理目标与资料要求，再开展方案对接。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={purchase.id} title={purchase.title} body={purchase.body} number="03" tone="muted">
        <NumberedList label="采购与负荷分析要点" items={[
          {title: "历史用电", body: "核对既有用电数据和采购结构。"},
          {title: "负荷变化", body: "考虑生产安排与业务增长。"},
          {title: "方案沟通", body: "比较服务内容与成本构成。"},
        ]} />
      </LandingSection>

      <LandingSection id={management.id} title={management.title} body={management.body} number="04">
        <div className="grid gap-0 border-y border-current/20 md:grid-cols-3">
          {["数据汇集", "运行分析", "改造评估"].map((label, index) => (
            <div className="border-b border-current/20 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 first:md:pl-0 last:md:border-r-0" key={label}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span><h3 className="mt-5 text-2xl font-semibold">{label}</h3>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={projects.id} title={projects.title} body={projects.body} number="05" tone="accent">
        <ol aria-label="清洁能源项目谱" className="m-0 list-none border-t border-current/30 p-0">
          {[
            ["分布式光伏", "核对场地与用电匹配。"],
            ["用户侧储能", "结合负荷特点评估。"],
            ["充换电设施", "核对使用场景与建设条件。"],
            ["合同能源管理", "明确实施主体与合作方式。"],
          ].map(([title, body], index) => (
            <li className="grid gap-3 border-b border-current/30 py-5 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,2fr)]" key={title}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span><h3 className="text-xl font-semibold">{title}</h3><p>{body}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection id={carbon.id} title={carbon.title} body={carbon.body} number="06">
        <p className="max-w-3xl border-l-2 border-current pl-6 text-lg leading-relaxed">服务边界：根据项目与数据基础沟通资料准备和后续工作范围；适用条件以具体方案为准。</p>
      </LandingSection>

      <LandingSection id={scenarios.id} title={scenarios.title} number="07" tone="muted">
        <NumberedList label="适用场景" items={scenarios.items ?? []} />
      </LandingSection>

      <LandingSection id={delivery.id} title={delivery.title} body={delivery.body} number="08" tone="dark">
        <ProcessRail label="能源服务评估流程" items={[
          {title: "数据准备", body: "汇总地区、规模、负荷和目标。"},
          {title: "需求沟通", body: "厘清采购与项目方向。"},
          {title: "可行性评估", body: "按资源、场地和实施条件讨论。"},
          {title: "范围确认", body: "明确主体、服务内容与下一步。"},
        ]} />
      </LandingSection>
    </div>
  );
}
