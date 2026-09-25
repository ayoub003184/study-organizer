# Paper Plan — personal study organizer

A responsive React organizer styled after the supplied mint-grid/paper-card reference. It includes the supplied 2026 and 2027 XMUM academic calendar images, the September 2026 timetable, course checklists, daily tasks, assignments, exams, meetings, and countdowns. Icons come from `lucide-react`.

The moon/sun button switches between light and dark mode and remembers the choice on each device. The weekly timetable shows one card per course per day; open it to see and edit all distinct class times or alternative groups. Weekend dates and the public holidays printed on the supplied calendars are highlighted in the year view. Holiday dates are subject to change according to the calendars.

## Put an icon on your phone or tablet

After deploying the latest files to Vercel, open the **production URL** in the device browser:

- **Android phone or tablet:** In Chrome, open the menu (three dots) and select **Install app** or **Add to Home screen**. Confirm the name **Paper Plan**.
- **iPhone or iPad:** In Safari, tap **Share → Add to Home Screen**, turn on **Open as Web App** if shown, then tap **Add**.

The icon opens the organizer in its own app window. Sign in with the same Supabase account on every device to see the same courses, tasks, and events. Internet access is required for synced data; this project does not cache private organizer data for offline use. The app icon and manifest are in `public/icons/` and `public/manifest.webmanifest`. There are no additional Supabase settings for home-screen installation.

The app works in **preview mode** immediately. Preview data is kept in that browser only. To sync between devices and receive emails, complete the setup below.

## 1. Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor**, paste all of [`supabase/schema.sql`](supabase/schema.sql), and run it once. This creates private tables with row-level security. Each account sees only its own data.
3. In **Authentication → Providers**, enable Email. In **Authentication → URL Configuration**, set **Site URL** to your eventual production Vercel URL. Add that URL to redirect URLs too. Email confirmation is optional; if enabled, configure Supabase email delivery for your users.
4. Copy **Project URL** and the **publishable/anon key** from **Project Settings → API Keys**. The service-role key is separate and must remain server-side.

On first sign-in, the five courses and class timetable are copied into your account. The source timetable shows alternative OS and Algorithms groups, so entries marked “Option” or “alternative group” should be removed if they are not yours. All personal classes, courses, tasks, exams, and meetings can be edited in the app.

If you already deployed an earlier ZIP, replace the project files in the same GitHub repository and push a new commit. Vercel will rebuild automatically. Existing Supabase data stays in place; these interface changes require no new SQL migration.

## 2. Resend email

1. Create a Resend account at [resend.com](https://resend.com/), verify a sending domain, then create an API key.
2. Set `REMINDER_FROM` to an address on that verified domain, such as `Paper Plan <reminders@yourdomain.com>`.
3. Reminders are sent to the signed-in Supabase account email. The event time is shown in Malaysia time (`Asia/Kuala_Lumpur`).

## 3. GitHub and Vercel

1. Extract this ZIP and upload **the contents of `study-organizer`** into a private GitHub repository. Never upload an actual `.env` file; `.gitignore` excludes it.
2. In [Vercel](https://vercel.com/), choose **Add New → Project → Import Git Repository**. If your repository root is `study-organizer`, leave **Root Directory** as `./`. If you uploaded this folder inside a larger repository, set Root Directory to `study-organizer`.
3. Choose **Framework Preset: Vite**, **Build Command: `npm run build`**, **Output Directory: `dist`**, and **Install Command: `npm install`**.
4. Set these Vercel **Environment Variables** for **Production** (and Preview if desired):

| Name | Value | Visibility |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase Project URL | Visible in the browser |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anon key | Visible in the browser; RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key | Server only; never prefix `VITE_` |
| `RESEND_API_KEY` | Resend API key | Server only |
| `REMINDER_FROM` | `Paper Plan <reminders@yourdomain.com>` | Server only |
| `CRON_SECRET` | A long random string (at least 32 characters) | Server only |

5. Deploy. Open the Vercel URL, create an account, and confirm the email if required. Add the deployed URL in Supabase Authentication URL Configuration. Redeploy after changing `VITE_` variables.

### Git push from a terminal

From the extracted `study-organizer` directory:

```bash
git init
git add .
git commit -m "Build personal study organizer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If the repository already has a remote, use its existing setup rather than adding another `origin`.

## 4. Schedule reminders every hour

Vercel Hobby cron currently supports only **once per day**, so this project uses **Supabase Cron** to call the secure Vercel endpoint every hour. After deploying:

1. Open [`supabase/hourly-reminders.sql`](supabase/hourly-reminders.sql).
2. Replace `https://YOUR-VERCEL-URL.vercel.app/api/reminders` with your production site URL followed by `/api/reminders`.
3. Replace `YOUR_CRON_SECRET` with the **same** `CRON_SECRET` set in Vercel. Do not commit the filled SQL file to GitHub.
4. Run the edited SQL in Supabase SQL Editor. It stores the URL and secret in Supabase Vault and schedules a call at five minutes past each UTC hour. Malaysia is UTC+8 year round, so it also runs hourly there.
5. Create a meeting or exam at least 14 days out to receive all day milestones. Events added later receive only future milestones.

Reminders go out approximately **14, 7, 3, 2, and 1 days before**, then approximately **every hour in the last 24 hours**. Each reminder is claimed once in the database; the mail API also receives an idempotency key. Scheduler and email-provider timing can vary by several minutes. If the scheduler is unavailable for more than about 75 minutes, a missed milestone is skipped. Emails require a working Resend sender and your Supabase user account's email address. Browser notifications, when enabled, work only while the organizer is open; email is the background notification channel. Assignment deadlines appear on their day but are not emailed automatically.

To stop the schedule: `select cron.unschedule('paper-plan-hourly');` in Supabase SQL Editor.

## Local run

```bash
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or omit them for browser-only preview mode)
npm install
npm run dev
```

Open the printed local URL. For a production check, run `npm run build`. The server API runs on Vercel; Vite's local development server does not execute `/api/reminders`.

## Project layout

- `src/App.jsx` — all five views and forms.
- `src/data.js` — starter class timetable and academic date summaries.
- `public/calendar/` — original XMUM 2026 and 2027 images supplied for this project.
- `supabase/schema.sql` — tables, private access policies, and live updates.
- `api/reminders.js` — secured email reminder endpoint.

Dates entered into meeting/exam forms are interpreted as **Malaysia time**, even when opening the organizer from another time zone. The year calendar images remain the original university reference; the month grid and term bands make them easier to scan.
