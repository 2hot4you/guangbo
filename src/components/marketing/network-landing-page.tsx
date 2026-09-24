import type {MarketingPage} from "@/content";
import {HomeHeroVisual} from "./home-hero-visual";
import {LandingHero, LandingSection, NumberedList, ProcessRail, styles} from "./landing-page-primitives";

const stations = ["客户站点", "本地接入", "区域汇聚资源", "骨干传输", "目标区域与站点"];

export function NetworkLandingPage({page}: {page: MarketingPage}) {
  const [inputs, products, enterpriseLine, dataCenter, fiberCloud, otn, branchNetwork, computeInterconnect, industryNetwork, continuity, interfaces, rollout] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="network-hero" eyebrow="NETWORK / CONNECTION ROUTE" title={page.hero.title} lead={page.hero.lead} tone="light" layout="split" visualPosition="start">
        <div className={styles.businessHeroVisual}>
          <HomeHeroVisual variant="link" active />
          <figure aria-label="首屏站点连接路径" className="border-y border-black/30 py-6 text-black">
            <ol aria-label="首屏连接概览" className="m-0 grid list-none grid-cols-3 gap-3 p-0">
              {["业务站点", "接入与传输", "目标业务"].map((station) => (
                <li className="min-w-0 border-t-2 border-black/70 pt-4 text-base leading-relaxed md:text-xl" key={station}>{station}</li>
              ))}
            </ol>
            <figcaption className="mt-5 text-sm text-black/65">站点路径示意：接入与传输方式按具体线路条件确认。</figcaption>
          </figure>
        </div>
      </LandingHero>

      <LandingSection id={products.id} title={products.title} number="01" tone="dark">
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

      <LandingSection id={enterpriseLine.id} title={enterpriseLine.title} body={enterpriseLine.body} number="03" tone="muted">
        <ProcessRail label="企业专线连接路径" items={[
          {title: "总部", body: "确认业务源站点与设备接口。"},
          {title: "传输路径", body: "结合合作资源评估接入和带宽。"},
          {title: "分支", body: "核对目标站点与业务访问方式。"},
        ]} />
      </LandingSection>

      <LandingSection id={dataCenter.id} title={dataCenter.title} body={dataCenter.body} number="04">
        <NumberedList label="机房互联评估要点" items={[
          {title: "两端机房", body: "明确位置、机房接口和交付界面。"},
          {title: "传输容量", body: "结合数据流量和扩容需求评估。"},
          {title: "路径安排", body: "按业务连续性要求核对资源条件。"},
        ]} />
      </LandingSection>

      <LandingSection id={fiberCloud.id} title={fiberCloud.title} body={fiberCloud.body} number="05" tone="accent">
        <div className="grid border-y border-current/30 md:grid-cols-2">
          <div className="border-b border-current/30 py-7 md:border-b-0 md:border-r md:pr-10"><h3 className="text-2xl font-semibold">光纤资源租赁</h3><p className="mt-3 opacity-70">核对光纤路由、交付界面和维护分工。</p></div>
          <div className="py-7 md:pl-10"><h3 className="text-2xl font-semibold">云网连接</h3><p className="mt-3 opacity-70">结合云端与本地部署评估接入方式。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={otn.id} title={otn.title} body={otn.body} number="06" tone="dark">
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

      <LandingSection id={branchNetwork.id} title={branchNetwork.title} body={branchNetwork.body} number="07" tone="muted">
        <ProcessRail label="总部分支互联" items={[
          {title: "站点分布", body: "确认总部与分支位置。"},
          {title: "流量方向", body: "梳理跨地业务访问。"},
          {title: "连接结构", body: "按实际路径条件讨论组网。"},
        ]} />
      </LandingSection>

      <LandingSection id={computeInterconnect.id} title={computeInterconnect.title} body={computeInterconnect.body} number="08">
        <NumberedList label="算力节点传输需求" items={[
          {title: "计算与存储", body: "梳理节点间数据传输任务。"},
          {title: "业务系统", body: "确认应用流量和连接要求。"},
          {title: "路径与接口", body: "核对容量、两端设备及交付方式。"},
        ]} />
      </LandingSection>

      <LandingSection id={industryNetwork.id} title={industryNetwork.title} body={industryNetwork.body} number="09" tone="accent">
        <div className="grid gap-4 border-y border-current/30 py-6 md:grid-cols-3">
          {["网络设计", "设备与监测", "运维协作"].map((item) => <p className="border-l-2 border-current/60 pl-4 text-lg" key={item}>{item}</p>)}
        </div>
      </LandingSection>

      <LandingSection id={continuity.id} title={continuity.title} body={continuity.body} number="10">
        <div className="space-y-3" aria-label="连续性考虑">
          {["主用路径 / 业务承载", "备选路径 / 可行性评估", "故障处理 / 责任分工"].map((item) => (
            <p className="border-l-4 border-current/30 bg-current/5 px-5 py-4 text-lg" key={item}>{item}</p>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={interfaces.id} title={interfaces.title} body={interfaces.body} number="11" tone="muted">
        <div className="grid border-y border-current/20 md:grid-cols-2">
          <div className="border-b border-current/20 py-7 md:border-b-0 md:border-r md:pr-10"><h3 className="text-2xl font-semibold">客户侧</h3><p className="mt-3 opacity-70">提供站点、设备、接口和现场配合条件。</p></div>
          <div className="py-7 md:pl-10"><h3 className="text-2xl font-semibold">服务侧</h3><p className="mt-3 opacity-70">核对合作资源、传输路径、维护与交付范围。</p></div>
        </div>
      </LandingSection>

      <LandingSection id={rollout.id} title={rollout.title} body={rollout.body} number="12" tone="accent">
        <ProcessRail label="线路实施步骤" items={[
          {title: "勘察", body: "核对地址、接入与施工条件。"},
          {title: "方案", body: "确认路径、接口和交付分工。"},
          {title: "施工", body: "按约定安排接入与联调。"},
          {title: "验收", body: "核对业务承载和约定指标。"},
        ]} />
      </LandingSection>

    </div>
  );
}
