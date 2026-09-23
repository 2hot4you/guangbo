import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/ai");

export default function AiPage() {
  return <MarketingPageView page={getPageByPath("/ai")} />;
}
