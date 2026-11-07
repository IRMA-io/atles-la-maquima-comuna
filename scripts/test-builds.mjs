import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const temp=fs.mkdtempSync(path.resolve('.build-test-'));
try{
 for(const folder of ['public','worker'])fs.cpSync(folder,path.join(temp,folder),{recursive:true});
 fs.mkdirSync(path.join(temp,'.openai'));
 fs.writeFileSync(path.join(temp,'.openai/hosting.json'),JSON.stringify({project_id:'test-fixture',d1:'DB',r2:null}));
 execFileSync(process.execPath,[path.resolve('scripts/build-worker.mjs')],{cwd:temp,stdio:'pipe',env:{...process.env,ATLES_OWNER_ID:''}});
 const built=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(temp,'dist/server/index.js'))).toString('base64'));
 assert.equal((await built.default.fetch(new Request('https://atles.test/'),{})).status,200);
 assert.equal((await built.default.fetch(new Request('https://atles.test/api/analytics/context',{headers:{'oai-authenticated-user-id':'spoofed'}}),{})).status,503);
 assert.equal((await built.default.fetch(new Request('https://atles.test/api/analytics/context'),{ATLES_ENABLE_SITES_ANALYTICS:'true'})).status,401);
 execFileSync(process.execPath,[path.resolve('scripts/build.mjs')],{cwd:temp,stdio:'pipe'});
 assert(fs.existsSync(path.join(temp,'dist/index.html')));
 assert(!fs.existsSync(path.join(temp,'dist/.openai')));
 assert(!fs.existsSync(path.join(temp,'dist/server')));
 assert.equal(JSON.parse(fs.readFileSync(path.join(temp,'dist/data.json'))).length,143);
 console.log('PASS: Worker assets, analytics disabled by default, auth check when enabled, and independent static output without deployment configuration.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
