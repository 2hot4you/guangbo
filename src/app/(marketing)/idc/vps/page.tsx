import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/idc/vps");

export default function IdcVpsPage() {
  return <MarketingPageView page={getPageByPath("/idc/vps")} />;
}
