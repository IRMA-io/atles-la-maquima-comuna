const fs=require('fs'),vm=require('vm'),assert=require('assert');
const records=JSON.parse(fs.readFileSync('public/data.json','utf8'));
const app=fs.readFileSync('public/app.js','utf8').split('document.addEventListener(')[0];
const memory=new Map();let failStorage=false;
function setup(){const nodes={};const node=s=>nodes[s]??={value:'',checked:false,innerHTML:'',textContent:'',classList:{add(){},remove(){}},showModal(){},focus(){},addEventListener(){}};const ctx={document:{querySelector:node,activeElement:null,dispatchEvent(){}},CustomEvent:class{},localStorage:{getItem:k=>memory.get(k)??null,setItem(k,v){if(failStorage)throw Error('quota');memory.set(k,v)}},URL,setTimeout,clearTimeout};vm.createContext(ctx);vm.runInContext(app,ctx);ctx.rows=records;vm.runInContext('data=rows',ctx);return {ctx,node,run:s=>vm.runInContext(s,ctx)};}
let {ctx,node,run}=setup();
assert.equal(run('CRITERIA.length'),14);
for(const r of records){ctx.resource=r;const dims=JSON.parse(run('JSON.stringify(dimensions(resource))'));assert.equal(dims.length,14);if(!r.reviews&&r.id!=='D14')assert(dims.every(d=>d[1]==='Pendent de revisió'&&d[2].includes('Cap observació')));}
for(const r of records.filter(r=>r.reviews)){assert.equal(r.reviews.length,14);for(const review of r.reviews){if(review.state==='documented'){assert(review.observation);assert(review.evidence.some(e=>e.url&&e.locator));}}}
run('detail("A01")');assert(!node('#dialogContent').innerHTML.includes('Indici documental'));assert(node('#dialogContent').innerHTML.includes('Guia de treball · sense anàlisi individual'));
run('detail("PAL01")');assert(node('#dialogContent').innerHTML.includes('Proposal permissions'));assert(node('#dialogContent').innerHTML.includes('Interpretació i límits'));
run('detail("D14")');assert(!node('#dialogContent').innerHTML.includes('data-review-form'));
const fields={state:'documented',observation:'Observació de prova, sense efectes reals.',interpretation:'Lectura de prova.',sourceTitle:'Font de prova',sourceURL:'https://example.org/source',locator:'Apartat 2',consulted:'2026-11-07',reviewer:'Prova local',next:'Contrastar amb una altra font.'};ctx.fields=fields;
assert(run('validateReview({...fields,sourceURL:""})').includes('Vincula'));
assert(run('validateReview({...fields,locator:""})').includes('Vincula'));
assert(run('validateReview({...fields,sourceURL:"javascript:alert(1)"})').includes('http'));
assert(run('validateReview({...fields,state:"verified"})').includes('vàlid'));
assert(run('validateReview({...fields,state:"tested",interpretation:""})').includes('context'));
assert(run('validateReview({...fields,state:"not_applicable",interpretation:""})').includes('justifica'));
assert.equal(run('storeReview(data.find(r=>r.id==="A01"),"C01",fields)'), '');
assert.equal(run('reviewRecord(data[0],0).origin'),'local');
assert.equal(run('reviewRecord(data[0],1).state'),'pending');
const exported=JSON.parse(run('JSON.stringify(catalogueExport())'));const exportedA=exported.resources.find(r=>r.id==='A01');assert.equal(exportedA.analysis[0].review.evidence[0].locator,'Apartat 2');assert.equal(exportedA.analysis[1].status,'Pendent de revisió');assert(exported.localReviews.A01.C01.history.length===1);assert.equal(exported.resources.find(r=>r.id==='D14').analysis.length,0);
node('#reviewStatus').value='documented';assert.equal(run('matches().length'),2);
node('#reviewStatus').value='local';assert.equal(run('matches()[0].id'),'A01');
node('#reviewStatus').value='pending';assert(!run('matches().some(r=>r.id==="A01"||r.id==="PAL01")'));
node('#reviewStatus').value='';
run('comparison=new Set(["A01","PAL01"]);compare()');assert(node('#dialogContent').innerHTML.includes('https://example.org/source'));
const original=JSON.stringify(records.find(r=>r.id==='PAL01').reviews);assert.equal(run('storeReview(data.find(r=>r.id==="PAL01"),"C08",fields)'),'');assert.equal(JSON.stringify(records.find(r=>r.id==='PAL01').reviews),original);assert.equal(run('reviewRecord(data.find(r=>r.id==="PAL01"),7).evidence[0].sourceId'),'LOCAL');
failStorage=true;const storedBefore=memory.get('atles.reviews.v1');assert(run('storeReview(data[0],"C02",fields)').includes('No s’ha pogut desar'));assert.equal(memory.get('atles.reviews.v1'),storedBefore);assert.equal(run('reviewRecord(data[0],1).state'),'pending');failStorage=false;
({ctx,node,run}=setup());assert.equal(run('reviewRecord(data[0],0).origin'),'local');assert.equal(run('reviewRecord(data[0],0).state'),'documented');
ctx.fields={...fields,observation:'<img src=x onerror=alert(1)>'};assert.equal(run('storeReview(data[0],"C01",fields)'),'');run('detail("A01")');assert(!node('#dialogContent').innerHTML.includes('<img src=x'));assert(node('#dialogContent').innerHTML.includes('&lt;img'));
assert.equal(JSON.parse(run('JSON.stringify(catalogueExport())')).localReviews.A01.C01.history.length,2);
assert.equal(run('resetReview(data[0],"C01")'),'');assert.equal(run('reviewRecord(data[0],0).origin'),'guide');assert.equal(run('reviewRecord(data[0],0).state'),'pending');assert(JSON.parse(run('JSON.stringify(catalogueExport())')).localReviews.A01.C01.archived);assert(JSON.parse(run('JSON.stringify(catalogueExport())')).localReviews.A01.C01.history.length===3);
console.log('PASS: pending guides; scoped source locators; per-criterion edits; validation; local persistence/reload; immutable baseline; quota failure; filtering; comparison; evidence/history export; escaping; excluded materials.');
