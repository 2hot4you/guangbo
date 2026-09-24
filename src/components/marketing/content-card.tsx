import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import type {ContentItem} from "@/content";

export function ContentCard({item}: {item: ContentItem}) {
  return (
    <article className="marketing-card">
      <h3 className="marketing-card__title">
        {item.href ? (
          <Link className="marketing-card__link" href={item.href}>
            <span>{item.title}</span><ArrowUpRight aria-hidden="true" />
          </Link>
        ) : item.title}
      </h3>
      {item.meta && <p className="marketing-card__meta">{item.meta}</p>}
      <p className="marketing-card__body">{item.body}</p>
    </article>
  );
}

export function ContentCards({items}: {items?: readonly ContentItem[]}) {
  if (!items?.length) return null;
  return <div className="marketing-grid mt-8">{items.map((item) => <ContentCard item={item} key={item.title} />)}</div>;
}
