import Link from "next/link";
import {navigationGroups, routeEntries} from "@/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-divider bg-surface text-sm text-muted">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="页脚导航">
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            <li><Link className="link inline-flex min-h-11 min-w-11 items-center justify-center px-2" href={routeEntries[0].path}>{routeEntries[0].navLabel}</Link></li>
            {navigationGroups.map((item) => (
              <li key={item.label}>
                <Link className="link inline-flex min-h-11 min-w-11 items-center justify-center px-2" href={item.kind === "group" ? item.overviewPath : item.path}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8">© {new Date().getFullYear()} 成都光波互联科技有限公司</p>
      </div>
    </footer>
  );
}
