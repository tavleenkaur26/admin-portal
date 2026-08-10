# MSc Society — Events Admin Portal

A full-stack event management portal built for the MSc Society Web Development Team recruitment task (Round 2). Admins can create, edit, and manage events from a protected dashboard; the public gets a fast, searchable events page with one-click registration.

**Live demo:** _add your Vercel URL here_
**Repo:** _add your GitHub URL here_

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Backend | Next.js API Routes (Node.js) |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js (Credentials provider, JWT sessions) |
| Image storage | Cloudinary (unsigned client-side upload) |
| Styling | Tailwind CSS |
| Validation | Zod (shared schema, client + server) |
| Data fetching | SWR |
| Deployment | Vercel |

---

## Features

### Core requirements
- **Admin auth**: login page, protected `/admin/dashboard/*` routes via middleware, logout
- **Full CRUD**: create, read, update, delete events from the dashboard
- **Event fields**: title, description, date, time, venue, category, banner image (Cloudinary upload), registration link
- **Public events page**: fetches from MongoDB, shows upcoming events, Register Now button opens the registration link in a new tab
- **Fully responsive**: tested at 375px (mobile), 768px (tablet), 1024px+ (desktop)

### Bonus features (all implemented)
- Search (debounced, MongoDB text index across title/description/venue)
- Category filter + upcoming/past/all timeframe filter
- Client + server-side form validation (Zod, shared schema)
- Loading skeletons (shimmer effect) instead of spinners
- Toast notifications for every action (create/update/delete/errors)
- Pagination on both the public and admin event lists
- Dark mode (persisted, system-aware, via `next-themes`)
- Distinct visual identity — serif display font + custom color palette, not default Tailwind styling

### Standout / differentiating features
These go beyond the brief's checklist — added to demonstrate product thinking, not just task completion:

1. **"Happening This Week" strip** — a horizontally scrollable highlight row above the main grid, surfacing events in the next 7 days with a "Today" badge. A flat chronological list buries what actually needs a decision soon; this mirrors how real events platforms (Luma, Eventbrite) solve that.
2. **Admin stats bar** — total/upcoming/past event counts and the most popular category, computed via a single MongoDB aggregation pipeline (not fetched-and-counted client-side), shown at the top of the dashboard.
3. **Individual event detail pages** (`/events/[slug]`) — proper dynamic routing with `generateMetadata` for SEO/Open Graph, instead of only card-based display.
4. **Duplicate/clone event** — one-click clone for recurring events (e.g. weekly workshops), so admins don't re-enter every field each time.
5. **Events grouped by date** on the public page (Today / Tomorrow / weekday headers) rather than a flat grid — easier to scan.

---

## Design Decisions & Assumptions

Documented per the brief's request, since several requirements were left open:

- **Auth model**: single hardcoded admin account via env vars (`ADMIN_EMAIL` + bcrypt-hashed `ADMIN_PASSWORD_HASH`), per the brief's "may be implemented using dummy credentials" allowance. Chose NextAuth over a fully custom JWT implementation for faster, more secure session handling — architecture supports swapping in a DB-backed multi-admin `Admin` collection later by only changing the `authorize()` function in `lib/auth.ts`.
- **Image storage**: used Cloudinary instead of storing files in MongoDB or on the Vercel filesystem, since Vercel's serverless functions have ephemeral storage and a request body limit — Cloudinary uploads happen directly from the browser, bypassing that limit entirely.
- **"Upcoming" vs "past"**: computed at query time (`date >= today`) rather than stored as a status field, so events never need a background job to "expire" them — this also means editing a date automatically moves an event between sections.
- **Slugs**: auto-generated from the title on creation, regenerated only if the title changes on edit (so existing shared links don't silently break from unrelated edits). Uniqueness enforced with a numeric suffix on collision.
- **Categories**: fixed enum (Workshop, Hackathon, Seminar, Competition, Talk, Bootcamp, Meetup, Other) rather than free text, to keep the filter UI and category badges consistent — can be extended in `models/Event.ts`.
- **Date + time**: stored as separate fields (`date`: Date, `time`: string) rather than a single combined datetime, since the UI treats them as independent inputs and this simplifies "group by day" logic on the public page.
- **Pagination**: 9 events per page on the public grid (clean 3-column layout), 8 per page on the admin list.

---

## Project Structure

```
src/
  app/
    admin/
      login/              — admin login page
      dashboard/          — protected: list, stats, search/filter
      dashboard/new/       — create event form
      dashboard/edit/[id]/ — edit event form
    events/
      page.tsx            — public events page
      [slug]/page.tsx      — public event detail page
    api/
      auth/[...nextauth]/  — NextAuth handler
      events/              — CRUD routes
      events/[id]/duplicate/ — clone route
      events/stats/        — aggregation stats route
      upload/               — (Cloudinary is called client-side directly)
  components/              — all shared UI components
  lib/                      — db connection, auth config, validation, cloudinary, slug util
  models/                   — Mongoose Event schema
  types/                    — shared TypeScript types
  middleware.ts             — route protection
scripts/
  hash-password.js          — generates bcrypt hash for admin password
```

---

## Setup Instructions

### 1. Clone & install
```bash
git clone <your-repo-url>
cd msc-events-portal
npm install
```

### 2. MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user (Database Access) and note the username/password
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) — required since Vercel has no static IP
4. Copy the connection string from **Connect → Drivers → Node.js**

### 3. Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Note your **Cloud Name** from the dashboard
3. Go to **Settings → Upload → Upload presets → Add upload preset**, set **Signing Mode** to **Unsigned**, save, and note the preset name

### 4. Generate admin password hash
```bash
node scripts/hash-password.js "your-chosen-password"
```
Copy the printed hash into `ADMIN_PASSWORD_HASH` below.

### 5. Environment variables
Copy `.env.example` to `.env.local` and fill in:
```bash
cp .env.example .env.local
```
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/msc-events?retryWrites=true&w=majority
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@mscsociety.com
ADMIN_PASSWORD_HASH=<from step 4>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your cloud name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your unsigned preset name>
```

### 6. Run locally
```bash
npm run dev
```
Visit `http://localhost:3000` — redirects to `/events`. Admin login is at `/admin/login`.

### 7. Deploy to Vercel
1. Push to GitHub
2. Import the repo in Vercel
3. Add all the same environment variables in **Project Settings → Environment Variables** (set `NEXTAUTH_URL` to your production URL)
4. Deploy

---

## Testing the CRUD flow

1. Log in at `/admin/dashboard` with your admin credentials
2. Click **Add Event**, fill the form, upload a banner image
3. Event appears on `/events` immediately (if dated today/future) and in the admin list
4. Try editing, duplicating, and deleting from the dashboard
5. Click **Register Now** on the public page — opens the link in a new tab

---

## Notes for reviewers

Every design decision above was made deliberately and I can walk through the reasoning for any of them, along with the code, in the interview — per the brief's requirement that AI-assisted work still be fully understood by the submitter.
