import { createClient } from '@supabase/supabase-js';

const milestones = [336,168,72,48,...Array.from({length:24},(_,i)=>24-i)].filter((v,i,a)=>a.indexOf(v)===i);
function label(hours) {return hours >= 48 ? `${hours/24} days` : `${hours} hour${hours === 1 ? '' : 's'}`;}

export default async function handler(req,res) {
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.CRON_SECRET;
  if (!token || req.headers.authorization !== `Bearer ${token}`) return res.status(401).json({error:'Unauthorized'});
  const {VITE_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,RESEND_API_KEY,REMINDER_FROM} = process.env;
  if (![VITE_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,RESEND_API_KEY,REMINDER_FROM].every(Boolean)) return res.status(500).json({error:'Reminder service is not configured'});
  const db = createClient(VITE_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
  const now = Date.now();
  const {data:events,error} = await db.from('events').select('id,user_id,title,kind,starts_at,created_at,venue,completed')
    .eq('completed',false).in('kind',['exam','meeting'])
    .gt('starts_at',new Date(now).toISOString()).lte('starts_at',new Date(now+337*3600000).toISOString()).limit(500);
  if (error) return res.status(500).json({error:'Could not load events'});
  let sent=0, failed=0;
  for (const event of events ?? []) {
    const diff=(Date.parse(event.starts_at)-now)/3600000;
    // One scheduled delivery per visit. Allow 75 minutes for a delayed hourly scheduler.
    const milestone=milestones.find(h=>diff<=h && diff>h-1.25 && Date.parse(event.created_at)<=Date.parse(event.starts_at)-h*3600000);
    if (!milestone) continue;
    const {data:claim,error:claimError}=await db.from('reminder_deliveries').insert({event_id:event.id,user_id:event.user_id,milestone_hours:milestone}).select('id').single();
    if (claimError) {if(claimError.code!=='23505') failed++;continue;}
    try {
      const {data:user,error:userError}=await db.auth.admin.getUserById(event.user_id);
      if (userError || !user?.user?.email) throw new Error('No email address');
      const date=new Intl.DateTimeFormat('en-MY',{timeZone:'Asia/Kuala_Lumpur',dateStyle:'full',timeStyle:'short'}).format(new Date(event.starts_at));
      const response=await fetch('https://api.resend.com/emails',{
        method:'POST',headers:{'Authorization':`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`paper-plan-${event.id}-${milestone}-${Date.parse(event.starts_at)}`},
        body:JSON.stringify({from:REMINDER_FROM,to:[user.user.email],subject:`${event.kind === 'exam' ? 'Exam' : 'Meeting'} in ${label(milestone)}: ${event.title}`,
          text:`${event.title}\n${date} (Malaysia time)\n${event.venue ? `Venue: ${event.venue}\n` : ''}\nOpen your organizer for details.`})
      });
      if(!response.ok) throw new Error(`Email provider returned ${response.status}`);
      await db.from('reminder_deliveries').update({sent_at:new Date().toISOString()}).eq('id',claim.id);
      sent++;
    } catch(e) {failed++;await db.from('reminder_deliveries').delete().eq('id',claim.id);}
  }
  return res.status(200).json({checked:events?.length??0,sent,failed});
}
