import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/ai/llm");

export default function AiLlmPage() {
  return <MarketingPageView page={getPageByPath("/ai/llm")} />;
}
