import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/idc");

export default function IdcPage() {
  return <MarketingPageView page={getPageByPath("/idc")} />;
}
