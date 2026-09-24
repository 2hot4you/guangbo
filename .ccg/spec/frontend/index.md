# Frontend conventions

## Public SEO metadata and indexing

- Keep route-specific title, description, canonical and social metadata on the explicit page module. The root layout may provide `metadataBase`, but must not spread home-page metadata, otherwise framework 404 output can inherit the home canonical and social URL.
- When the production hostname is not confirmed, emit page-level `noindex, nofollow` and allow crawlers to read that directive; do not rely on `Disallow: /` as a noindex mechanism. Enable indexing only for a production HTTPS origin that is neither local nor a reserved example hostname.

## In-page navigation in App Router

- Treat actual `history.pushState` / `history.replaceState` commits as the source of truth for hash navigation. A click handler alone misses delayed commits and repeated activation of the current hash.
- Keep ordinary route-top restoration separate from hash-navigation revisions. Coupling both concerns in one effect can cancel the corrective animation frame during a route transition and leave the page a few pixels below the absolute top.
- After a mobile navigation drawer exits, focus the unique hash target without adding it to the normal tab order; support browser back/forward and repeated same-hash activation as first-class cases.
