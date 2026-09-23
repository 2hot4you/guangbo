import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/ai/image");

export default function AiImagePage() {
  return <MarketingPageView page={getPageByPath("/ai/image")} />;
}
