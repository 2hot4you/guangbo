import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/ai/video");

export default function AiVideoPage() {
  return <MarketingPageView page={getPageByPath("/ai/video")} />;
}
