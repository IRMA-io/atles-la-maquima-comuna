import fs from 'node:fs';
const assets={},types={html:'text/html',css:'text/css',js:'text/javascript',json:'application/json'};
for(const file of fs.readdirSync('public')){const ext=file.split('.').pop();if(!types[ext])continue;assets['/'+file]={body:fs.readFileSync('public/'+file,'utf8'),type:types[ext]+'; charset=utf-8'};}
if(!fs.existsSync('.openai/hosting.json'))throw Error('Create .openai/hosting.json for your own Sites project before building the Worker.');
const manifest=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));
if(manifest.static)throw Error('Worker deployment must not declare static output');
fs.rmSync('dist',{recursive:true,force:true});
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
const code=fs.readFileSync('worker/api.mjs','utf8');
fs.writeFileSync('dist/server/index.js',code+'\nconst assets='+JSON.stringify(assets)+';\nconst app=createApp(assets,'+JSON.stringify(process.env.ATLES_OWNER_ID||'')+');\nexport default {fetch(request,env){if(new URL(request.url).pathname.startsWith("/api/") && env.ATLES_ENABLE_SITES_ANALYTICS!=="true")return new Response("Analytics disabled",{status:503});return app.fetch(request,env);}};\n');
fs.writeFileSync('dist/.openai/hosting.json',JSON.stringify(manifest,null,2));
console.log('Worker built with embedded assets and D1 analytics.');
