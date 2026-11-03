# Consolidated review

## Red-green evidence

- Initial targeted unit run: 26 passed, 4 failed because the H200 and RTX 5090 articles did not yet exist on either page.
- After resource/detail implementation: 29 passed, 1 failed because the homepage still rendered only the first resource.
- After homepage implementation: 30/30 targeted marketing tests passed.

## Independent reviews

- Content review: PASS; no Critical findings and no unresolved content warnings.
- Engineering review: PASS after cache and test-evidence warnings were resolved.

## Verification

- Targeted marketing and content tests: 40/40 passed.
- Full Vitest suite: 192/192 passed across 14 files.
- TypeScript: passed after clean `.next` rotation.
- ESLint: passed.
- Next.js production build: passed; 18 static pages generated.
- Targeted Playwright SSR, six-width layout, and keyboard-focus checks: 6/6 passed across desktop and mobile Chromium.

## Result

No unresolved Critical or Warning findings. Ready for exact-scope commit, push, and immutable-image deployment.

## Production deployment

- Application commit: `0f4fd94bec35b0cf76dd023a88913a152393c088`.
- Release archive SHA-256 matched before extraction: `9eb6d72ece7552fcfc63b949410573ec289aba0d29330dbe37688dbca0a34a57`.
- Compose backup checksum matched the active pre-deploy file.
- New immutable image: `guangbo-web:0f4fd94bec35b0cf76dd023a88913a152393c088`.
- Running image ID matched the built image ID: `sha256:276197b8f3e32cb4171c4d1cb18758c505a75333f85cbdbef75388bcc034071e`.
- Container state: running and healthy, zero restarts.
- Port binding remained `127.0.0.1:43187:43187`.
- Local homepage, public homepage, and public `/idc/bare-metal` returned 200 and contained all three products and the three new price values.
- Public detail HTML contained the H200 CPUs/GPUs, five-year cooperation, three-year 7×24 maintenance, RTX 5090 GPU, Southwest region and about-one-month delivery; no `4090` appeared.
- Public robots.txt and sitemap origin were verified; the previous image and Compose backup remain available for rollback.
