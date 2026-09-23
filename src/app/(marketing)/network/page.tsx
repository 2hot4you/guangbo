import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/network");

export default function NetworkPage() {
  return <MarketingPageView page={getPageByPath("/network")} />;
}
