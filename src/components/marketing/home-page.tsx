import {ArrowRight, ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {getPageByPath} from "@/content";
import type {ContentSection, MarketingPage, PublicPath} from "@/content";
import {HomeHeroCarousel} from "./home-hero-carousel";
import type {HomeHeroSlideContent} from "./home-hero-types";
import {ModelEcosystemLoop} from "./model-ecosystem-loop";

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
  const heroSlides = [
    {index: "01", label: "AI", title: page.hero.title, body: page.hero.lead, href: "/ai", cta: "探索大模型", variant: "ai"},
    {index: "02", label: "COMPUTE", title: idc.title, body: idc.body!, href: "/idc", cta: "查看IDC与算力", variant: "compute"},
    {index: "03", label: "XINCHUANG", title: supporting[0].title, body: supporting[0].body!, href: "/madeinchina", cta: "了解信创与数字化", variant: "xinchang"},
    {index: "04", label: "LINK", title: supporting[1].title, body: supporting[1].body!, href: "/network", cta: "查看专线网络", variant: "link"},
    {index: "05", label: "ENERGY", title: supporting[2].title, body: supporting[2].body!, href: "/energy", cta: "了解清洁能源", variant: "energy"},
  ] as const satisfies readonly HomeHeroSlideContent[];

  return (
    <>
      <HomeHeroCarousel slides={heroSlides} />

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
          <div className="home-models__layout">
            <div className="site-container">
              <p className="home-section__index home-section__index--dark">AI / MODEL ECOSYSTEM</p>
              <h3 id="model-ecosystem-heading">{ecosystem.title}</h3>
              <p>{ecosystem.body}</p>
            </div>
            <ModelEcosystemLoop />
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
