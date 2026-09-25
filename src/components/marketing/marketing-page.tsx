import {getRouteByPath} from "@/content";
import type {MarketingPage, PageTemplate} from "@/content";
import {AboutLandingPage} from "./about-landing-page";
import {AiLandingPage} from "./ai-landing-page";
import {CompanyPage} from "./company-page";
import {EnergyLandingPage} from "./energy-landing-page";
import {HomePage} from "./home-page";
import {IdcLandingPage} from "./idc-landing-page";
import {ModelPage} from "./model-page";
import {NetworkLandingPage} from "./network-landing-page";
import {OverviewPage} from "./overview-page";
import {RelatedServices} from "./related-services";
import {SolutionPage} from "./solution-page";
import {XinchangLandingPage} from "./xinchang-landing-page";

function assertNever(value: never): never {
  throw new Error(`Unsupported marketing template: ${value}`);
}

export function MarketingPageView({page}: {page: MarketingPage}) {
  const route = getRouteByPath(page.path);
  const template: PageTemplate = route.template;
  let content;

  switch (page.path) {
    case "/ai": content = <AiLandingPage page={page} />; break;
    case "/idc": content = <IdcLandingPage page={page} />; break;
    case "/madeinchina": content = <XinchangLandingPage page={page} />; break;
    case "/network": content = <NetworkLandingPage page={page} />; break;
    case "/energy": content = <EnergyLandingPage page={page} />; break;
    case "/about": content = <AboutLandingPage page={page} />; break;
    default:
      switch (template) {
        case "home": content = <HomePage page={page} />; break;
        case "overview": content = <OverviewPage page={page} />; break;
        case "model": content = <ModelPage page={page} />; break;
        case "solution": content = <SolutionPage page={page} />; break;
        case "company": content = <CompanyPage page={page} />; break;
        default: return assertNever(template);
      }
  }

  return <>{content}<RelatedServices paths={route.relatedPaths} /></>;
}
