import {MarketingPageView} from "@/components/marketing/marketing-page";
import {getPageByPath} from "@/content";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  return <MarketingPageView page={getPageByPath("/")} />;
}
