import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/idc/gpu");

export default function IdcGpuPage() {
  return <MarketingPageView page={getPageByPath("/idc/gpu")} />;
}
