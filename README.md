# MSC IGDTUW Events Admin Portal

Full-stack admin portal for managing MSC IGDTUW events 

**Live site:** https://msceventsportal.vercel.app
**Repo:** https://github.com/tavleenkaur26/admin-portal

Admins can log in and create/edit/delete events from a dashboard. Everyone else sees a public events page where they can browse and hit "Register Now" to go sign up.

### Tech stack

* Next.js 15 (App Router)
* MongoDB + Mongoose
* NextAuth.js for admin login
* Cloudinary for image uploads
* Tailwind CSS
* Zod for form validation
* Deployed on Vercel

### Project Structure

```text
admin-portal/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── login/
│   │   ├── api/
│   │   │   └── events/
│   │   └── events/
│   │       └── [slug]/
│   ├── components/
│   ├── lib/
│   ├── models/
│   ├── types/
│   └── middleware.ts
├── scripts/
│   └── hash-password.js
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Project setup instructions

1. Clone the repo and install dependencies

```bash
git clone https://github.com/tavleenkaur26/admin-portal.git
cd admin-portal
npm install
```

2. Set up MongoDB Atlas — create a free cluster, a database user, and allow network access from anywhere (0.0.0.0/0) since Vercel doesn't have a fixed IP. Grab the connection string.

3. Set up Cloudinary — create a free account, note your cloud name, and create an unsigned upload preset (Settings → Upload → Upload presets).

4. Generate an admin password hash:

```bash
node scripts/hash-password.js "yourpassword"
```

This prints a bcrypt hash — you'll need it for the env file below.

5. Copy `.env.example` to `.env.local` and fill in your values:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

Note: locally, Next.js tries to expand `$` signs in env files as variables, so the bcrypt hash (which has `$` in it) needs backslashes in front of each `$` — e.g. `\$2a\$10\$...`. This is only needed in `.env.local`, not when adding the same variable on Vercel.

6. Run it:

```bash
npm run dev
```

Visit `localhost:3000` — it redirects to `/events`. Admin login is at `/admin/login`.

7. To deploy: push to GitHub, import into Vercel, add the same env variables in Project Settings, and update `NEXTAUTH_URL` to the real deployed URL after the first deploy (then redeploy once more).

### Assumptions made during development

* It was allowed to do auth using dummy credentials, so I went with a single hardcoded admin account (email + bcrypt-hashed password in env vars) via NextAuth, rather than building out a full multi-admin system with its own database collection. 
* Used Cloudinary instead of storing images directly, since Vercel's serverless functions don't have persistent file storage and have a request size limit — uploads go straight from the browser to Cloudinary.
* "Upcoming" vs "past" events aren't stored as a status in the database — it's just calculated based on whether the event's date is before or after today, at the time of the request. So editing a date automatically moves it between sections without any extra logic needed.
* Each event gets a URL slug generated automatically from its title (for individual event pages). If two events have the same title, a number gets appended so the slug stays unique.
* Categories are a fixed list (Workshop, Hackathon, Seminar, Competition, Talk, Bootcamp, Meetup, Other) instead of free text, so the filter dropdown and category tags stay consistent.
* Date and time are stored as two separate fields rather than one combined datetime, since the form treats them as separate inputs and it made grouping events by day simpler on the public page.
* Public page shows 9 events per page, admin dashboard shows 8 per page.

### Features implemented

**Required:**

* Admin login, protected dashboard routes, logout
* Full CRUD for events (create, view, edit, delete)
* All required fields: title, description, date, time, venue, category, banner image upload, registration link
* Public events page pulling from MongoDB, with a Register Now button that opens the registration link in a new tab
* Responsive layout across mobile/tablet/desktop

**Bonus features:**

* Search by name/venue/keyword
* Category filter + upcoming/past/all filter
* Form validation on both client and server (same Zod schema reused for both, so the rules can't drift apart)
* Loading skeletons instead of spinners
* Toast notifications for every action
* Pagination on both public and admin views
* Dark mode toggle (remembers preference)
* Custom visual design (see below)

**Extra stuff:**

* A "Happening This Week" section on the public page that highlights events in the next 7 days, since a flat list of every upcoming event makes it easy to miss what actually needs attention soon
* A small stats bar on the admin dashboard (total events, upcoming, past, most popular category) — computed with a MongoDB aggregation query rather than counting on the frontend
* Individual event pages (`/events/event-slug`) with their own URL, instead of only showing events as cards
* A "duplicate" button on each event in the admin dashboard, for cloning recurring events instead of re-typing everything
* Events on the public page are grouped by date (Today / Tomorrow / etc.) instead of just a plain grid

### Design notes

Intentionally moved away from the typical purple/rounded-corner look a lot of AI-generated UIs default to. Went with a warmer, more editorial style instead — cream background, black borders, a rust/orange accent color, and a bold serif font for headings, so it reads more like an event poster than a generic dashboard template. Still fully supports dark mode.

## Demo Admin Login
For testing/review purposes:
- Email: admin@mscsociety.com
- Password: newpassword123
