import Image from "next/image";
import Link from "next/link";
import {DesktopNavigation} from "./desktop-navigation";
import {MobileNavigation} from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="border-b border-divider bg-background">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="光波互联，返回首页"
          className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
        >
          <Image alt="" className="h-auto w-36 sm:w-40" height={111} priority src="/brand/guangbo-logo.png" width={407} />
        </Link>
        <DesktopNavigation />
        <MobileNavigation />
      </div>
    </header>
  );
}
