const fs=require('fs'),vm=require('vm'),assert=require('assert');
const rows=JSON.parse(fs.readFileSync('public/data.json','utf8'));
const elements={};const el=s=>elements[s]??=( {value:'',checked:false,addEventListener(){}} );
const context={document:{querySelector:el},localStorage:{getItem(){return null}},console,URL,setTimeout,clearTimeout};vm.createContext(context);
let code=fs.readFileSync('public/app.js','utf8').split("document.addEventListener(")[0];vm.runInContext(code,context);context.rows=rows;
vm.runInContext('data=rows',context);
assert.equal(vm.runInContext('matches().length',context),143);
el('#search').value='teatre';assert(vm.runInContext('matches().some(r=>r.id==="I03")',context));assert(vm.runInContext('matches().every(r=>r.category!=="decisions")',context));el('#search').value='';
el('#region').value='Àfrica';assert(vm.runInContext('matches().length>=4',context));assert(vm.runInContext('matches().every(r=>r.region==="Àfrica")',context));el('#region').value='';
el('#language').value='català';assert(vm.runInContext('matches().some(r=>r.id==="G15")',context));el('#language').value='';
el('#onlySaved').checked=true;assert.equal(vm.runInContext('matches().length',context),0);vm.runInContext('saved.add("C02")',context);assert.equal(vm.runInContext('matches()[0].id',context),'C02');el('#onlySaved').checked=false;
vm.runInContext('need="decide"',context);assert(vm.runInContext('matches().every(r=>["decisions","conflicte"].includes(r.category))',context));vm.runInContext('need=""',context);
assert.equal(vm.runInContext('safeURL("javascript:alert(1)")',context),'#');assert.equal(vm.runInContext('safeURL("https://example.org")',context),'https://example.org/');assert.equal(vm.runInContext('esc("<script>")',context),'&lt;script&gt;');
for(const r of rows){assert(new URL(r.url));context.r=r;assert.equal(vm.runInContext('dimensions(r).length',context),14);assert(vm.runInContext('Boolean(CAT[r.category])',context));}
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
const html=fs.readFileSync('public/index.html','utf8');assert(html.includes('lang="ca"'));for(const file of ['style.css','app.js','data.json'])assert(fs.existsSync('public/'+file));
console.log('Verified: 143 records; 14 dimensions each; keyword, regional, language, saved and needs filters; safe links/escaping; local assets. Browser QA unavailable: preview relay missing.');
