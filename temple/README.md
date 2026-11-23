# ISKCON Hadapsar — Independent public temple pages

This folder contains a new static, mobile-responsive version of the publicly visible ISKCON Hadapsar website, built into the existing `IskconHadapsar` repository without replacing or altering the app's existing feature pages.

## Pages
- `/temple/` — temple homepage
- `/temple/katha25/` — Bhagavat Katha, with Dec 2025 festival marked as archived
- `/temple/gita-mahayagna/` — Gita programs
- `/temple/dc/` — 2025 Drawing Competition archive
- `/temple/dindi/` — Dindi and Wari service
- `/temple/prabhupada-prasad/` — prasadam service

All pages are standard HTML/CSS/vanilla JS; no database or old Hostinger credentials are required to serve them. The mobile app homepage links to this section.

## Asset and service independence
- Layout, navigation, copy and styling are hosted in this repository and do not fetch HTML from `iskconhadapsar.com`.
- The home content image is the repository's existing `/krishna.webp`.
- The current temple logo is referenced from the official donation portal's static asset domain. For completely offline/self-contained operation, the temple should supply a locally owned logo file.
- External donation link: `https://givehadapsar.iskconpunecamp.com/give?remark=Other+Seva`; donations are not processed by this static site.
- Phone and email are displayed as published on the original website.

## Important scope and cautions
This is a **functional public-site recreation**, not a pixel-for-pixel extraction of the former developer's full original website. Original page-builder templates, private databases, form submissions, paid assets, admin access and backend workflows cannot be recovered from public pages alone. Current content is selectively rewritten and consolidated for readability. Where original forms refer to past dated events, registration is not presented as open.

If the original `iskconhadapsar.com` domain is controlled by the former developer, its DNS cannot be moved without registrar/domain owner access. These pages can be published independently under the user's Vercel-connected project and the domain that user controls.
