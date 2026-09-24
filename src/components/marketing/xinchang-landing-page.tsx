import type {MarketingPage} from "@/content";
import {LandingHero, LandingSection, NumberedList, ProcessRail} from "./landing-page-primitives";

export function XinchangLandingPage({page}: {page: MarketingPage}) {
  const [diagnostic, layers, hardware, applications, data, compatibility, industries, delivery] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="madeInChina-hero" eyebrow="XINCHUANG / SYSTEM BLUEPRINT" title={page.hero.title} lead={page.hero.lead} tone="dark">
        <figure aria-label="企业系统四层架构蓝图" className="mt-12 border border-white/30">
          <ol className="m-0 grid list-none grid-cols-2 p-0 md:grid-cols-4">
            {layers.items?.map((item, index) => (
              <li className="min-w-0 border-b border-white/25 px-4 py-4 md:border-b-0" key={item.title}>
                <span className="font-mono text-xs text-lime-300">L{index + 1}</span>
                <strong className="mt-2 block text-lg font-semibold">{item.title}</strong>
              </li>
            ))}
          </ol>
          <figcaption className="border-t border-white/25 px-5 py-3 text-sm text-white/65">架构概览：从接入到基础设施，按业务范围组合验证。</figcaption>
        </figure>
      </LandingHero>

      <LandingSection id={diagnostic.id} title={diagnostic.title} body={diagnostic.body} number="01" tone="muted">
        <NumberedList label="需求诊断次序" items={[
          {title: "识别现有环境", body: "盘点已有系统、使用角色与部署位置。"},
          {title: "确认业务问题", body: "找出需要新建、连接或迁移的流程。"},
          {title: "确定验证范围", body: "优先选择一个可衡量的业务场景。"},
        ]} />
      </LandingSection>

      <LandingSection id={layers.id} title={layers.title} body={layers.body} number="02">
        <figure aria-label="系统分层详图" className="architecture-blueprint border border-current/20">
          <ol className="m-0 list-none p-0">
            {layers.items?.map((item, index) => (
              <li className="grid gap-4 border-b border-current/20 p-5 last:border-b-0 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,2fr)] md:items-baseline md:px-8" key={item.title}>
                <span className="font-mono text-xs opacity-65">LAYER {String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="max-w-2xl leading-relaxed opacity-70">{item.body}</p>
              </li>
            ))}
          </ol>
          <figcaption className="px-5 py-4 text-sm opacity-60 md:px-8">架构示意：各层按项目组合，接口和数据流转范围需逐项确认。</figcaption>
        </figure>
      </LandingSection>

      <LandingSection id={hardware.id} title={hardware.title} body={hardware.body} number="03" tone="dark">
        <div className="grid gap-0 border-t border-white/30 md:grid-cols-3">
          {["桌面工作站", "企业服务器", "多卡计算节点"].map((label, index) => (
            <div className="border-b border-white/30 py-8 md:border-r md:px-6 first:md:pl-0 last:md:border-r-0" key={label}>
              <span className="font-mono text-xs text-lime-300">0{index + 1}</span>
              <h3 className="mt-5 text-2xl">{label}</h3>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={applications.id} title={applications.title} number="04" tone="muted">
        <ol aria-label="企业业务应用流程" className="m-0 list-none border-t border-current/20 p-0">
          {applications.items?.map((item, index) => (
            <li className="grid gap-3 border-b border-current/20 py-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,2fr)] md:gap-8" key={item.title}>
              <span aria-hidden="true" className="font-mono text-xs opacity-65">0{index + 1}</span>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="leading-relaxed opacity-70">{item.body}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      <LandingSection id={data.id} title={data.title} body={data.body} number="05">
        <ProcessRail label="数据保护生命周期" items={[
          {title: "识别", body: "按访问频率与保存要求梳理数据。"},
          {title: "保护", body: "明确备份和分层存储方式。"},
          {title: "恢复", body: "核对恢复路径、容量与管理责任。"},
        ]} />
      </LandingSection>

      <LandingSection id={compatibility.id} title={compatibility.title} body={compatibility.body} number="06" tone="accent">
        <NumberedList label="适配验证清单" items={[
          {title: "基础环境", body: "处理器、操作系统与部署位置。"},
          {title: "数据与应用", body: "数据库、业务软件版本和接口。"},
          {title: "交付条件", body: "授权、迁移依赖、维护与验收范围。"},
        ]} />
      </LandingSection>

      <LandingSection id={industries.id} title={industries.title} number="07">
        <div className="grid gap-x-12 border-t border-current/20 md:grid-cols-2">
          {industries.items?.map((item) => (
            <div className="border-b border-current/20 py-7" key={item.title}>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-relaxed opacity-70">{item.body}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={delivery.id} title={delivery.title} body={delivery.body} number="08" tone="dark">
        <ProcessRail label="分阶段验证与交付" items={[
          {title: "样例验证", body: "选择明确的业务流程和适配目标。"},
          {title: "范围确认", body: "核对软件、接口与服务责任。"},
          {title: "逐步扩展", body: "在验证结果基础上连接后续系统。"},
        ]} />
      </LandingSection>
    </div>
  );
}
