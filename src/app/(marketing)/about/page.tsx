import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/about");

export default function AboutPage() {
  return <MarketingPageView page={getPageByPath("/about")} />;
}
