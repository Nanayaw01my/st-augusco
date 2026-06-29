# AUGUSCO Website + Admin Backend

St. Augustine's Senior High School (Bogoso) website, with a built-in admin
dashboard for managing news, gallery photos, departments/HODs, and school
authorities — no code changes required for day-to-day updates.

## Stack

- **Frontend:** static HTML/CSS/JS (`index.html`, `assets/`)
- **Backend:** Node.js + Express (`server.js`, `server/`)
- **Database:** MongoDB (Atlas recommended)
- **Image hosting:** Cloudinary
- **Admin dashboard:** static pages served at `/admin` (`admin/`)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard (free tier is fine)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the first admin account

3. Seed the database (creates the admin login and pre-fills departments/authorities/news with the current site content):
   ```
   npm run seed
   ```

4. Start the server:
   ```
   npm start
   ```

5. Visit:
   - `http://localhost:10000/` — public website
   - `http://localhost:10000/admin` — admin login

## Deploying on Render

1. Create a **Web Service** (not a static site) pointing at this repo/branch.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add the same environment variables from `.env` in Render's dashboard.
5. After first deploy, run the seed script once via Render's shell (or a one-off job): `npm run seed`

## Admin Dashboard

Log in at `/admin` with the email/password set in `.env` (`ADMIN_EMAIL` /
`ADMIN_PASSWORD`). From the dashboard an administrator can:

- Publish/edit/delete **news** posts (with optional photo)
- Upload/delete **gallery** photos
- Add/edit/delete **departments**, their course lists, and HOD photo + name
- Add/edit/delete **school authorities** (Headmaster, Assistant Heads, Key Officers) with photos and bios

Changes made in the dashboard appear on the live site immediately — the
homepage fetches departments, authorities, news, and gallery from the API on
page load and falls back to the original static content if the API is ever
unreachable.
