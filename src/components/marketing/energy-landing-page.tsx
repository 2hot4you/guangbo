import type {MarketingPage} from "@/content";
import {HomeHeroVisual} from "./home-hero-visual";
import {LandingHero, LandingSection, NumberedList, ProcessRail, styles} from "./landing-page-primitives";

export function EnergyLandingPage({page}: {page: MarketingPage}) {
  const [inputs, services, purchase, greenPower, management, efficiency, solar, storage, charging, carbon, scenarios, delivery] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="energy-hero" eyebrow="ENERGY / ENTERPRISE PATH" title={page.hero.title} lead={page.hero.lead} tone="light" layout="split" compact>
        <div className={styles.businessHeroVisual}>
          <HomeHeroVisual variant="energy" active />
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
        </div>
      </LandingHero>

      <LandingSection id={inputs.id} title={inputs.title} body={inputs.body} number="01" tone="accent">
        <figure aria-label="企业用能输入资料" className="energy-flow border-y border-current/20 py-7">
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-4">
            {[
              ["所在地区", "提供用能位置与场地条件，明确讨论的项目范围。"],
              ["用电规模", "汇总用电数据与现有采购安排，说明需求规模。"],
              ["历史负荷", "准备负荷曲线和生产计划，梳理用电变化。"],
              ["绿色用能目标", "说明绿电、绿证或节能项目方向，明确评估重点。"],
            ].map(([title, detail], index) => (
              <li className="min-w-0 border-l-2 border-black/60 py-3 pl-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-5" key={title}>
                <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm opacity-65">{detail}</p>
              </li>
            ))}
          </ol>
          <figcaption className="mt-7 text-sm opacity-65">输入资料：先梳理四项起点，再结合企业数据与项目条件沟通。</figcaption>
        </figure>
      </LandingSection>

      <LandingSection id={services.id} title={services.title} body={services.body} number="02" tone="dark">
        <NumberedList label="能源服务方向" items={[
          {title: "交易与绿色采购", body: "沟通电力市场化交易、绿电与绿证需求。"},
          {title: "管理与节能", body: "结合负荷和设备运行评估服务方向。"},
          {title: "项目与碳业务", body: "按场地、数据和实施条件开展对接。"},
        ]} />
      </LandingSection>

      <LandingSection id={purchase.id} title={purchase.title} body={purchase.body} number="03" tone="muted">
        <NumberedList label="采购与负荷分析要点" items={[
          {title: "历史用电", body: "核对既有用电数据和采购结构。"},
          {title: "负荷变化", body: "考虑生产安排与业务增长。"},
          {title: "方案沟通", body: "比较服务内容与成本构成。"},
        ]} />
      </LandingSection>

      <LandingSection id={greenPower.id} title={greenPower.title} body={greenPower.body} number="04" tone="dark">
        <div className="grid gap-8 border-t border-white/30 pt-7 md:grid-cols-2">
          <div><span className="font-mono text-xs text-lime-300">PATH A</span><h3 className="mt-3 text-2xl">绿电需求</h3><p className="mt-3 leading-relaxed text-white/70">确认采购周期、需求规模与适用服务方案。</p></div>
          <div><span className="font-mono text-xs text-lime-300">PATH B</span><h3 className="mt-3 text-2xl">绿证需求</h3><p className="mt-3 leading-relaxed text-white/70">梳理目标与资料要求，再开展方案对接。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={management.id} title={management.title} body={management.body} number="05">
        <div className="grid gap-0 border-y border-current/20 md:grid-cols-3">
          {["数据汇集", "运行分析", "改造评估"].map((label, index) => (
            <div className="border-b border-current/20 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 first:md:pl-0 last:md:border-r-0" key={label}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span><h3 className="mt-5 text-2xl font-semibold">{label}</h3>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={efficiency.id} title={efficiency.title} body={efficiency.body} number="06" tone="accent">
        <ProcessRail label="节能项目评估路径" items={[
          {title: "识别设备", body: "梳理运行状态和能耗数据。"},
          {title: "确定改造", body: "讨论适用的节能措施。"},
          {title: "明确合作", body: "确认合同能源管理的主体与分工。"},
        ]} />
      </LandingSection>

      <LandingSection id={solar.id} title={solar.title} body={solar.body} number="07">
        <NumberedList label="光伏项目条件" items={[
          {title: "场地条件", body: "确认可讨论的建设位置。"},
          {title: "用电需求", body: "结合负荷与业务安排评估。"},
          {title: "实施资源", body: "按项目条件组织方案对接。"},
        ]} />
      </LandingSection>

      <LandingSection id={storage.id} title={storage.title} body={storage.body} number="08" tone="muted">
        <div className="grid border-y border-current/20 md:grid-cols-3">
          {["负荷特点", "场地条件", "运行目标"].map((item) => <p className="border-b border-current/20 py-6 text-xl md:border-b-0 md:border-r md:px-6 first:md:pl-0 last:md:border-r-0" key={item}>{item}</p>)}
        </div>
      </LandingSection>

      <LandingSection id={charging.id} title={charging.title} body={charging.body} number="09" tone="accent">
        <ProcessRail label="充换电项目起点" items={[
          {title: "使用场景", body: "梳理车辆和用户需求。"},
          {title: "供电条件", body: "核对场地与接入条件。"},
          {title: "方案对接", body: "确认实施资源与责任范围。"},
        ]} />
      </LandingSection>

      <LandingSection id={carbon.id} title={carbon.title} body={carbon.body} number="10">
        <p className="max-w-3xl border-l-2 border-current pl-6 text-lg leading-relaxed">服务边界：根据项目与数据基础沟通资料准备和后续工作范围；适用条件以具体方案为准。</p>
      </LandingSection>

      <LandingSection id={scenarios.id} title={scenarios.title} number="11" tone="muted">
        <NumberedList label="适用场景" items={scenarios.items ?? []} />
      </LandingSection>

      <LandingSection id={delivery.id} title={delivery.title} body={delivery.body} number="12" tone="dark">
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
