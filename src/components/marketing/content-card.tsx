import {Card} from "@heroui/react";
import Link from "next/link";
import type {ContentItem} from "@/content";

export function ContentCard({item}: {item: ContentItem}) {
  return (
    <Card className="marketing-card" variant="default">
      <Card.Header>
        <Card.Title className="marketing-card__title">
          {item.href ? <Link className="marketing-card__link" href={item.href}>{item.title}</Link> : item.title}
        </Card.Title>
        {item.meta && <Card.Description>{item.meta}</Card.Description>}
      </Card.Header>
      <Card.Content className="marketing-card__body text-muted">{item.body}</Card.Content>
    </Card>
  );
}

export function ContentCards({items}: {items?: readonly ContentItem[]}) {
  if (!items?.length) return null;
  return <div className="marketing-grid mt-8">{items.map((item) => <ContentCard item={item} key={item.title} />)}</div>;
}
