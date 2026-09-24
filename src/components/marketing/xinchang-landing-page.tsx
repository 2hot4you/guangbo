import type {MarketingPage} from "@/content";
import {HomeHeroVisual} from "./home-hero-visual";
import {LandingHero, LandingSection, NumberedList, ProcessRail, styles} from "./landing-page-primitives";

export function XinchangLandingPage({page}: {page: MarketingPage}) {
  const [diagnostic, layers, hardware, localAi, customerService, onlineServices, orders, afterSales, data, compatibility, industries, delivery] = page.sections;

  return (
    <div data-landing-page={page.key}>
      <LandingHero id="madeInChina-hero" eyebrow="XINCHUANG / SYSTEM BLUEPRINT" title={page.hero.title} lead={page.hero.lead} tone="light" layout="split">
        <div className={styles.businessHeroVisual}>
          <HomeHeroVisual variant="xinchang" active />
          <figure aria-label="企业系统四层架构蓝图" className="border border-black/30">
            <ol className="m-0 grid list-none grid-cols-2 p-0 md:grid-cols-4">
              {layers.items?.map((item, index) => (
                <li className="min-w-0 border-b border-black/25 px-4 py-4 md:border-b-0" key={item.title}>
                  <span className="inline-block bg-black px-1.5 py-0.5 font-mono text-xs text-[var(--accent)]">L{index + 1}</span>
                  <strong className="mt-2 block text-lg font-semibold">{item.title}</strong>
                </li>
              ))}
            </ol>
            <figcaption className="border-t border-black/25 px-5 py-3 text-sm text-black/65">架构概览：从接入到基础设施，按业务范围组合验证。</figcaption>
          </figure>
        </div>
      </LandingHero>

      <LandingSection id={diagnostic.id} title={diagnostic.title} body={diagnostic.body} number="01" tone="dark">
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

      <LandingSection id={localAi.id} title={localAi.title} body={localAi.body} number="04" tone="accent">
        <ProcessRail label="本地 AI 环境核对" items={[
          {title: "数据边界", body: "确认知识与业务数据的使用范围。"},
          {title: "运行环境", body: "核对模型、计算设备与软件适配。"},
          {title: "业务验证", body: "用实际任务检验方案。"},
        ]} />
      </LandingSection>

      <LandingSection id={customerService.id} title={customerService.title} body={customerService.body} number="05" tone="muted">
        <NumberedList label="客户服务环节" items={customerService.items ?? []} />
      </LandingSection>

      <LandingSection id={onlineServices.id} title={onlineServices.title} body={onlineServices.body} number="06">
        <ProcessRail label="线上办理流程" items={[
          {title: "资料提交", body: "梳理客户与业务资料。"},
          {title: "核验授权", body: "确认适用的身份核验与授权方式。"},
          {title: "签约变更", body: "对接签约及后续业务流程。"},
        ]} />
      </LandingSection>

      <LandingSection id={orders.id} title={orders.title} body={orders.body} number="07" tone="dark">
        <NumberedList label="经营系统连接点" items={orders.items ?? []} />
      </LandingSection>

      <LandingSection id={afterSales.id} title={afterSales.title} body={afterSales.body} number="08" tone="muted">
        <ProcessRail label="售后工单流程" items={[
          {title: "受理与派单", body: "确定入口和处理角色。"},
          {title: "现场处理", body: "记录工程师处理与进度。"},
          {title: "反馈与评价", body: "追踪结果和服务反馈。"},
        ]} />
      </LandingSection>

      <LandingSection id={data.id} title={data.title} body={data.body} number="09">
        <ProcessRail label="数据保护生命周期" items={[
          {title: "识别", body: "按访问频率与保存要求梳理数据。"},
          {title: "保护", body: "明确备份和分层存储方式。"},
          {title: "恢复", body: "核对恢复路径、容量与管理责任。"},
        ]} />
      </LandingSection>

      <LandingSection id={compatibility.id} title={compatibility.title} body={compatibility.body} number="10" tone="accent">
        <NumberedList label="适配验证清单" items={[
          {title: "基础环境", body: "处理器、操作系统与部署位置。"},
          {title: "数据与应用", body: "数据库、业务软件版本和接口。"},
          {title: "交付条件", body: "授权、迁移依赖、维护与验收范围。"},
        ]} />
      </LandingSection>

      <LandingSection id={industries.id} title={industries.title} number="11">
        <div className="grid gap-x-12 border-t border-current/20 md:grid-cols-2">
          {industries.items?.map((item) => (
            <div className="border-b border-current/20 py-7" key={item.title}>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-relaxed opacity-70">{item.body}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection id={delivery.id} title={delivery.title} body={delivery.body} number="12" tone="dark">
        <ProcessRail label="分阶段验证与交付" items={[
          {title: "样例验证", body: "选择明确的业务流程和适配目标。"},
          {title: "范围确认", body: "核对软件、接口与服务责任。"},
          {title: "逐步扩展", body: "在验证结果基础上连接后续系统。"},
        ]} />
      </LandingSection>
    </div>
  );
}
