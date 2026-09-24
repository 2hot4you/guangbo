import type {MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail} from "./landing-page-primitives";

const stations = ["客户站点", "本地接入", "区域汇聚资源", "骨干传输", "目标区域与站点"];

export function NetworkLandingPage({page}: {page: MarketingPage}) {
  const [products, inputs, topology, solutions, continuity, interfaces, rollout, boundaries] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="network-hero" eyebrow="NETWORK / CONNECTION ROUTE" title={page.hero.title} lead={page.hero.lead} tone="dark">
        <figure aria-label="首屏站点连接路径" className="mt-14 border-y border-white/30 py-6 text-white">
          <ol aria-label="首屏连接概览" className="m-0 grid list-none grid-cols-3 gap-3 p-0">
            {["业务站点", "接入与传输", "目标业务"].map((station) => (
              <li className="min-w-0 border-t-2 border-lime-300 pt-4 text-base leading-relaxed md:text-xl" key={station}>{station}</li>
            ))}
          </ol>
          <figcaption className="mt-5 text-sm text-white/65">站点路径示意：接入与传输方式按具体线路条件确认。</figcaption>
        </figure>
      </LandingHero>

      <LandingSection id={products.id} title={products.title} number="01">
        <NumberedList label="连接产品类型" items={products.items ?? []} />
      </LandingSection>

      <LandingSection id={inputs.id} title={inputs.title} body={inputs.body} number="02" tone="accent">
        <dl className="grid gap-x-10 border-t border-current/30 md:grid-cols-4">
          {[
            ["01", "两端地址", "判断本地接入与目标位置。"],
            ["02", "预计带宽", "结合业务流量评估容量。"],
            ["03", "接口类型", "核对现有设备与交付界面。"],
            ["04", "业务用途", "确认承载业务与连续性要求。"],
          ].map(([number, title, body]) => (
            <div className="border-b border-current/30 py-6" key={number}>
              <dt className="font-mono text-xs opacity-65">{number} / {title}</dt>
              <dd className="mt-5 text-lg leading-relaxed">{body}</dd>
            </div>
          ))}
        </dl>
      </LandingSection>

      <LandingSection id={topology.id} title={topology.title} body={topology.body} number="03" tone="dark">
        <figure aria-label="站点连接结构" className="network-landing-topology border-y border-white/30 bg-[#080808] py-8 text-white">
          <ol aria-label="站点连接路径" className="m-0 grid list-none gap-4 p-0 md:grid-cols-5 md:gap-2">
            {stations.map((station) => (
              <li className="relative flex min-w-0 items-center gap-4 border-l-2 border-lime-300 py-4 pl-4 md:min-h-36 md:flex-col md:items-start md:border-l-0 md:border-t-2 md:pl-0" key={station}>
                <span className="text-xl font-medium leading-tight">{station}</span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-6 text-sm text-white/65">示意路径：具体接入、传输与保护方式按线路条件确认。</figcaption>
        </figure>
      </LandingSection>

      <LandingSection id={solutions.id} title={solutions.title} number="04" tone="muted">
        <ol aria-label="组网场景" className="m-0 list-none border-t border-current/20 p-0">
          {solutions.items?.map((item, index) => (
            <li className="grid gap-3 border-b border-current/20 py-7 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,2fr)]" key={item.title}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="leading-relaxed opacity-70">{item.body}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection id={continuity.id} title={continuity.title} body={continuity.body} number="05">
        <div className="space-y-3" aria-label="连续性考虑">
          {["主用路径 / 业务承载", "备选路径 / 可行性评估", "故障处理 / 责任分工"].map((item) => (
            <p className="border-l-4 border-current/30 bg-current/5 px-5 py-4 text-lg" key={item}>{item}</p>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={interfaces.id} title={interfaces.title} body={interfaces.body} number="06" tone="muted">
        <div className="grid border-y border-current/20 md:grid-cols-2">
          <div className="border-b border-current/20 py-7 md:border-b-0 md:border-r md:pr-10"><h3 className="text-2xl font-semibold">客户侧</h3><p className="mt-3 opacity-70">提供站点、设备、接口和现场配合条件。</p></div>
          <div className="py-7 md:pl-10"><h3 className="text-2xl font-semibold">服务侧</h3><p className="mt-3 opacity-70">核对合作资源、传输路径、维护与交付范围。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={rollout.id} title={rollout.title} body={rollout.body} number="07" tone="accent">
        <ProcessRail label="线路实施步骤" items={[
          {title: "勘察", body: "核对地址、接入与施工条件。"},
          {title: "方案", body: "确认路径、接口和交付分工。"},
          {title: "施工", body: "按约定安排接入与联调。"},
          {title: "验收", body: "核对业务承载和约定指标。"},
        ]} />
      </LandingSection>

      <LandingSection id={boundaries.id} title={boundaries.title} body={boundaries.body} number="08" tone="dark">
        <p className="max-w-3xl border-t border-white/30 pt-7 text-sm leading-relaxed text-white/65">线路可行性、时延、保护方式、服务指标及施工周期均以实际勘察和具体方案为准。</p>
      </LandingSection>
    </div>
  );
}
