import Link from "next/link";
import {getRouteByPath} from "@/content";
import type {PublicPath} from "@/content";

export function RelatedServices({paths}: {paths: readonly PublicPath[]}) {
  if (paths.length === 0) return null;
  return (
    <section aria-labelledby="related-services-heading" className="related-services section-space" id="related-services">
      <div className="site-container">
        <h2 className="marketing-section__title" id="related-services-heading">相关服务</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {paths.map((path) => (
            <li key={path}>
              <Link className="link inline-flex rounded-lg border border-border bg-surface px-4 py-2 text-link" href={path}>
                {getRouteByPath(path).navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
