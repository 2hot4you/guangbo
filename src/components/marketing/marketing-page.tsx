import {getRouteByPath} from "@/content";
import type {MarketingPage, PageTemplate} from "@/content";
import {MarketingBreadcrumbs} from "./breadcrumbs";
import {CompanyPage} from "./company-page";
import {HomePage} from "./home-page";
import {ModelPage} from "./model-page";
import {OverviewPage} from "./overview-page";
import {RelatedServices} from "./related-services";
import {SolutionPage} from "./solution-page";

function assertNever(value: never): never {
  throw new Error(`Unsupported marketing template: ${value}`);
}

export function MarketingPageView({page}: {page: MarketingPage}) {
  const route = getRouteByPath(page.path);
  const template: PageTemplate = route.template;
  let content;

  switch (template) {
    case "home": content = <HomePage page={page} />; break;
    case "overview": content = <OverviewPage page={page} />; break;
    case "model": content = <ModelPage page={page} />; break;
    case "solution": content = <SolutionPage page={page} />; break;
    case "company": content = <CompanyPage page={page} />; break;
    default: return assertNever(template);
  }

  return <><MarketingBreadcrumbs path={page.path} />{content}<RelatedServices paths={route.relatedPaths} /></>;
}
