# ISKCON Hadapsar temple website
This directory hosts a **new responsive recreation** of the publicly accessible ISKCON Hadapsar temple website alongside (not in place of) the existing Harinam Diksha invitation. 

## Where it is served
- Public temple homepage: https://iskconhadapsar.online/ (host-specific Vercel rewrite)
- All pages: https://iskconhadapsar.online/temple/
- Original Diksha invitation: https://diksha.toolgi.online/
- Temple section from invitation footer: `/temple/`

## Implemented public pages
- `/temple/` — Home, about, activities and gallery
- `/temple/katha25/` — Bhagavat Katha and 2025 festival archive
- `/temple/gita-mahayagna/` — Bhagavad Gita activities
- `/temple/dc/` — Drawing Competition archive
- `/temple/dindi/` — Wari, Dindi and service
- `/temple/prabhupada-prasad/` — Prasadam distribution

## Images and styles
- Shared stylesheet: `temple.css`, scoped to temple pages, with responsive layouts
- Shared mobile-nav script: `temple.js`
- Committed image assets: `assets/brand.svg`, `assets/krishna.webp`, `assets/krishna-child.webp`, `assets/iskcon-artwork.webp`, `assets/flute-cover.webp`, `assets/bells-cover.webp`
- Reuses existing repository images `/guru.jpeg`, `/gallery-2.png`, `/gallery-3.png` and `/gallery-4.png`, without modifying them.

**Image provenance and scope:** Original photos from the old `iskconhadapsar.com` Hostinger website could not be automatically downloaded. The images included here are from existing, user-controlled GitHub projects and must not be assumed to depict each specific historical event. The website does not rely on the old site to render images or CSS, but the external donation portal remains an outbound service.

This is **not a pixel-for-pixel copy** of the original theme or a recovery of private registrations and database. Past 2025 and early 2026 competitions are marked historical rather than presenting expired registration forms as active.
