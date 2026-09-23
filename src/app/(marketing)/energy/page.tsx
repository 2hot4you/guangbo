import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/energy");

export default function EnergyPage() {
  return <MarketingPageView page={getPageByPath("/energy")} />;
}
