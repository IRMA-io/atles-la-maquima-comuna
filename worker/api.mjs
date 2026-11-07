const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY=86400000;
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export function madridParts(date){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return {day:`${p.year}-${p.month}-${p.day}`,hour:Number(p.hour)};}
export function createApp(assets,ownerId){
 const resourceIDs=new Set(JSON.parse(assets['/data.json'].body).map(x=>x.id));
 return {async fetch(request,env){
  const u=new URL(request.url),uid=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email'),isOwner=Boolean(uid)&&(uid===ownerId||Boolean(env.ANALYTICS_OWNER_EMAIL&&email&&email.toLowerCase()===env.ANALYTICS_OWNER_EMAIL.toLowerCase()));
  if(u.pathname.startsWith('/api/')){
   if(!uid)return json({error:'Cal iniciar sessió.'},401);
   if(u.pathname==='/api/analytics/context'&&request.method==='GET')return json({isOwner,available:Boolean(env.DB),timezone:'Europe/Madrid',retentionDays:90});
   if(!env.DB)return json({error:'L’emmagatzematge analític no està disponible.'},503);
   if(u.pathname==='/api/analytics/events'&&request.method==='POST'){
    if(request.headers.get('origin')!==u.origin)return json({error:'Origen no admès.'},403);
    if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Format no admès.'},415);
    let body;try{const text=await request.text();if(text.length>2048)return json({error:'Petició massa gran.'},413);body=JSON.parse(text);}catch{return json({error:'JSON invàlid.'},400)}
    if(body.enabled!==true||!UUID.test(body.eventId||'')||!UUID.test(body.sessionId||'')||!['site_view','resource_view','external_link'].includes(body.kind))return json({error:'Esdeveniment invàlid.'},400);
    const resource=body.kind==='site_view'?null:body.resourceId;
    if(body.kind!=='site_view'&&!resourceIDs.has(resource))return json({error:'Recurs no admès.'},400);
    // No persistent visitor identity is stored. The random, expiring session is hashed.
    const session=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(body.sessionId)))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const now=Date.now(),local=madridParts(new Date(now));
    await env.DB.batch([
     env.DB.prepare('DELETE FROM analytics_events WHERE created_at < ?').bind(now-90*DAY),
     env.DB.prepare('INSERT OR IGNORE INTO analytics_events (event_id,created_at,day_local,hour_local,kind,resource_id,is_owner,session_key) VALUES (?,?,?,?,?,?,?,?)').bind(body.eventId,now,local.day,local.hour,body.kind,resource,isOwner?1:0,session)
    ]);
    return json({recorded:true});
   }
   if(u.pathname==='/api/analytics/summary'&&request.method==='GET'){
    if(!isOwner)return json({error:'Aquest panell és exclusiu de la propietària.'},403);
    const rawDays=Number(u.searchParams.get('days')||30),days=[7,30,90].includes(rawDays)?rawDays:30;
    const audience=['all','owner','others'].includes(u.searchParams.get('audience'))?u.searchParams.get('audience'):'others';
    const now=Date.now(),cutoff=now-days*DAY,where='created_at >= ?'+(audience==='owner'?' AND is_owner = 1':audience==='others'?' AND is_owner = 0':'');
    const queries=[
     `SELECT COUNT(*) AS events,COUNT(DISTINCT session_key) AS sessions,COALESCE(SUM(CASE WHEN kind='site_view' THEN 1 ELSE 0 END),0) AS pageviews,COALESCE(SUM(CASE WHEN kind='resource_view' THEN 1 ELSE 0 END),0) AS resourceviews,COALESCE(SUM(CASE WHEN kind='external_link' THEN 1 ELSE 0 END),0) AS externalclicks,MIN(created_at) AS first_at FROM analytics_events WHERE ${where}`,
     `SELECT resource_id,COALESCE(SUM(CASE WHEN kind='resource_view' THEN 1 ELSE 0 END),0) AS opens,COALESCE(SUM(CASE WHEN kind='external_link' THEN 1 ELSE 0 END),0) AS exits FROM analytics_events WHERE ${where} AND resource_id IS NOT NULL GROUP BY resource_id ORDER BY opens DESC,exits DESC,resource_id LIMIT 142`,
     `SELECT day_local AS day,COUNT(*) AS events,COUNT(DISTINCT session_key) AS sessions,COALESCE(SUM(CASE WHEN kind='resource_view' THEN 1 ELSE 0 END),0) AS opens FROM analytics_events WHERE ${where} GROUP BY day_local ORDER BY day_local`,
     `SELECT hour_local AS hour,COUNT(*) AS events,COALESCE(SUM(CASE WHEN kind='resource_view' THEN 1 ELSE 0 END),0) AS opens FROM analytics_events WHERE ${where} GROUP BY hour_local ORDER BY hour_local`,
     `SELECT created_at,kind,resource_id,is_owner FROM analytics_events WHERE ${where} ORDER BY created_at DESC LIMIT 50`,
     'SELECT MIN(created_at) AS first_at FROM analytics_events WHERE created_at >= ?'
    ];
    const results=await env.DB.batch(queries.map(q=>env.DB.prepare(q).bind(cutoff)));
    return json({days,audience,timezone:'Europe/Madrid',retentionDays:90,generatedAt:now,from:cutoff,totals:results[0].results[0],resources:results[1].results,daily:results[2].results,hourly:results[3].results,recent:results[4].results,firstRecordedAt:results[5].results[0]?.first_at??null});
   }
   return json({error:'Ruta o mètode no admès.'},404);
  }
  if(!['GET','HEAD'].includes(request.method))return new Response('Mètode no admès',{status:405});
  const key=u.pathname==='/'?'/index.html':u.pathname;
  const asset=assets[key];if(!asset)return new Response('No trobat',{status:404});
  return new Response(request.method==='HEAD'?null:asset.body,{headers:{'content-type':asset.type,'cache-control':key==='/index.html'?'no-cache':'public, max-age=300','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','permissions-policy':'camera=(), microphone=(), geolocation=()'}});
 }};
}
