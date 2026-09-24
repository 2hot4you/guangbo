import {ArrowRight, ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {getPageByPath} from "@/content";
import type {ContentSection, MarketingPage, PublicPath} from "@/content";

const modelNames = ["DeepSeek", "GLM", "Kimi", "Qwen", "Claude", "Gemini", "GPT", "Grok", "Seedance", "FLUX"];
const supportingDomains = ["XINCHUANG", "LINK", "ENERGY"] as const;
const supportingPaths = ["/madeinchina", "/network", "/energy"] as const satisfies readonly PublicPath[];

function sectionById(page: MarketingPage, id: string): ContentSection {
  const section = page.sections.find((entry) => entry.id === id);
  if (!section) throw new Error(`Missing home section: ${id}`);
  return section;
}

function ServiceList({section}: {section: ContentSection}) {
  return (
    <ol className="home-service-list">
      {section.items?.map((item, index) => {
        const content = (
          <>
            <span className="home-service-item__number">{String(index + 1).padStart(2, "0")}</span>
            <div className="home-service-item__content">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            {item.href && <ArrowUpRight aria-hidden="true" />}
          </>
        );

        return (
          <li key={item.title}>
            {item.href
              ? <Link aria-label={item.title} className="home-service-item" href={item.href}>{content}</Link>
              : <div className="home-service-item">{content}</div>}
          </li>
        );
      })}
    </ol>
  );
}

function DomainVisual({label, variant}: {label: string; variant: string}) {
  return (
    <div aria-hidden="true" className={`home-domain__visual home-domain__visual--${variant}`}>
      <span className="home-domain__ring home-domain__ring--outer" />
      <span className="home-domain__ring home-domain__ring--inner" />
      <span className="home-domain__nodes" />
      <span className="home-domain__label">{label}</span>
    </div>
  );
}

export function HomePage({page}: {page: MarketingPage}) {
  const ai = sectionById(page, "ai");
  const ecosystem = sectionById(page, "model-ecosystem");
  const idc = sectionById(page, "idc");
  const delivery = sectionById(page, "delivery");
  const about = sectionById(page, "about");
  const supporting = ["madeinchina", "network", "energy"].map((id) => sectionById(page, id));

  return (
    <>
      <section aria-labelledby="home-title" className="home-hero">
        <div className="site-container home-hero__layout">
          <div className="home-hero__copy">
            <p className="home-eyebrow">AI · COMPUTE · XINCHUANG · LINK · ENERGY</p>
            <h1 className="home-hero__title text-balance" id="home-title">{page.hero.title}</h1>
            <p className="home-hero__lead">{page.hero.lead}</p>
            <div className="home-hero__actions">
              <Link className="home-action home-action--primary" href="/ai">
                探索大模型 <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="home-action home-action--secondary" href="/idc">
                查看IDC与算力 <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="home-signal">
            <div className="home-signal__orbit home-signal__orbit--outer" />
            <div className="home-signal__orbit home-signal__orbit--inner" />
            <div className="home-signal__core">G</div>
            <span className="home-signal__label home-signal__label--one">AI</span>
            <span className="home-signal__label home-signal__label--two">COMPUTE</span>
            <span className="home-signal__label home-signal__label--three">XINCHUANG</span>
            <span className="home-signal__label home-signal__label--four">LINK</span>
            <span className="home-signal__label home-signal__label--five">ENERGY</span>
          </div>
        </div>
        <div aria-label="业务领域" className="site-container home-domain-strip">
          <span>大模型</span><span>算力</span><span>信创</span><span>专线网络</span><span>清洁能源</span>
        </div>
      </section>

      <section aria-labelledby="ai-heading" className="home-section home-ai" id="ai">
        <div className="site-container">
          <div className="home-ai__intro">
            <div className="home-section__heading">
              <p className="home-section__index">01 / AI</p>
              <h2 id="ai-heading">{ai.title}</h2>
              <p>从理解、创作到动态内容，按业务目标选择模型能力。</p>
            </div>
            <DomainVisual label="AI" variant="ai" />
          </div>
          <ol className="home-capability-list">
            {ai.items?.map((item, index) => (
              <li key={item.title}>
                <Link aria-label={item.title} className="home-capability" href={item.href!}>
                  <span className="home-capability__number">0{index + 1}</span>
                  <div className="home-capability__content">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="home-capability__arrow" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div aria-labelledby="model-ecosystem-heading" className="home-models" id="model-ecosystem">
          <div className="site-container home-models__layout">
            <div>
              <p className="home-section__index home-section__index--dark">AI / MODEL ECOSYSTEM</p>
              <h3 id="model-ecosystem-heading">{ecosystem.title}</h3>
              <p>{ecosystem.body}</p>
            </div>
            <ul aria-label="代表模型系列" className="home-models__names">
              {modelNames.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="idc-heading" className="home-section home-idc" id="idc">
        <div className="site-container home-idc__layout">
          <div className="home-section__heading home-section__heading--sticky">
            <p className="home-section__index">02 / COMPUTE</p>
            <h2 id="idc-heading">{idc.title}</h2>
            <p>{idc.body}</p>
            <DomainVisual label="COMPUTE" variant="compute" />
          </div>
          <ServiceList section={idc} />
        </div>
      </section>

      <div className="home-domains">
        {supporting.map((section, index) => {
          const reverse = index % 2 === 0 ? " home-domain--reverse" : "";
          return (
            <section aria-labelledby={`${section.id}-heading`} className={`home-section home-domain home-domain--${section.id}${reverse}`} id={section.id} key={section.id}>
              <div className="site-container home-domain__layout">
                <div className="home-section__heading home-section__heading--sticky">
                  <p className="home-section__index">0{index + 3} / {supportingDomains[index]}</p>
                  <h2 id={`${section.id}-heading`}>{section.title}</h2>
                  {section.body && <p>{section.body}</p>}
                  <Link className="home-text-link" href={supportingPaths[index]}>查看完整服务 <ArrowRight aria-hidden="true" /></Link>
                  <DomainVisual label={supportingDomains[index]} variant={String(index + 1)} />
                </div>
                <ServiceList section={section} />
              </div>
            </section>
          );
        })}
      </div>

      <section aria-labelledby="delivery-heading" className="home-delivery" id="delivery">
        <div className="site-container home-delivery__layout">
          <p className="home-section__index home-section__index--dark">DELIVERY</p>
          <h2 id="delivery-heading">{delivery.title}</h2>
          <p>{delivery.body}</p>
          <Link className="home-action home-action--accent" href="/about">了解我们的协作方式 <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-labelledby="about-heading" className="home-section home-about" id="about">
        <div className="site-container home-about__layout">
          <h2 id="about-heading">{about.title}</h2>
          <div>
            <p>{about.body}</p>
            <p>{getPageByPath("/about").hero.lead}</p>
            <Link className="home-text-link" href="/about">了解光波互联 <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
