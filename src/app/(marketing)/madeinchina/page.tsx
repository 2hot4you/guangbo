import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/madeinchina");

export default function MadeInChinaPage() {
  return <MarketingPageView page={getPageByPath("/madeinchina")} />;
}
