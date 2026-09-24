import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {getRouteByPath} from "@/content";
import type {PublicPath} from "@/content";

export function RelatedServices({paths}: {paths: readonly PublicPath[]}) {
  if (paths.length === 0) return null;
  return (
    <section aria-labelledby="related-services-heading" className="related-services section-space" id="related-services">
      <div className="site-container related-services__layout">
        <h2 className="marketing-section__title" id="related-services-heading">继续了解</h2>
        <ul>
          {paths.map((path) => (
            <li key={path}>
              <Link href={path}><span>{getRouteByPath(path).navLabel}</span><ArrowUpRight aria-hidden="true" /></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
