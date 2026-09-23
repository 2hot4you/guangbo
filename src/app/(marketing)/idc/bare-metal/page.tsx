import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/idc/bare-metal");

export default function IdcBareMetalPage() {
  return <MarketingPageView page={getPageByPath("/idc/bare-metal")} />;
}
