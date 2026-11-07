import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/build-pages.mjs'],{stdio:'pipe'});
for(const file of ['index.html','research.html','palantir.html','app.js','research.js','palantir.js','style.css','data.json'])assert(fs.existsSync('docs/'+file),file);
assert(fs.existsSync('docs/.nojekyll'));
assert(!fs.existsSync('docs/analytics.js'));
assert.equal(JSON.parse(fs.readFileSync('docs/data.json')).length,143);
for(const file of ['index.html','research.html','palantir.html','app.js','style.css']){
 const source=fs.readFileSync('docs/'+file,'utf8');
 assert(!/href="\/(?!\/)/.test(source),file+' has a domain-root link');
 if(file.endsWith('.html')){
  assert(!source.includes('src="analytics.js"'));
  assert(source.includes('Autoria i condicions'));
  for(const [,href]of source.matchAll(/(?:href|src)="(\.\/[^"#]*|[^/:"#]+\.(?:css|js))[^"\s]*"/g)){
   const local=href.split('#')[0].replace(/^\.\//,'');
   if(local)assert(fs.existsSync('docs/'+local),file+' references '+local);
  }
 }
}
assert(fs.readFileSync('docs/palantir.html','utf8').includes('href="./#resource=PAL01"'));
assert(fs.readFileSync('docs/app.js','utf8').includes('href="./palantir.html"'));
console.log('PASS: project-site navigation, detail link, all assets, 143 records, attribution and no analytics script.');
