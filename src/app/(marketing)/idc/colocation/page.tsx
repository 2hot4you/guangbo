import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/idc/colocation");

export default function IdcColocationPage() {
  return <MarketingPageView page={getPageByPath("/idc/colocation")} />;
}
