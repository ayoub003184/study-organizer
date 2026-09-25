-- Optional scheduler for Vercel Hobby. Run AFTER deploying the website and setting CRON_SECRET.
-- Replace both placeholders before executing in the Supabase SQL Editor. Keep this filled file private.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
select vault.create_secret('https://YOUR-VERCEL-URL.vercel.app/api/reminders', 'paper_plan_reminder_url');
select vault.create_secret('YOUR_CRON_SECRET', 'paper_plan_cron_secret');
select cron.schedule('paper-plan-hourly', '5 * * * *', $$
 select net.http_get(
  url := (select decrypted_secret from vault.decrypted_secrets where name = 'paper_plan_reminder_url' limit 1),
  headers := jsonb_build_object('Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'paper_plan_cron_secret' limit 1)),
  timeout_milliseconds := 30000
 );
$$);
-- To stop: select cron.unschedule('paper-plan-hourly');
