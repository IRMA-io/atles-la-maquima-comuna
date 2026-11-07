import fs from 'node:fs';
const output=process.env.PAGES_OUTPUT||'docs';
if(!['docs','dist-pages'].includes(output))throw Error('PAGES_OUTPUT must be docs or dist-pages');
fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
for(const file of fs.readdirSync('public')){
 if(file==='analytics.js')continue;
 let content=fs.readFileSync('public/'+file,'utf8');
 if(/\.(html|js|css)$/.test(file))content=content.replace(/href="\/(?=[^/])/g,'href="./').replace(/href="\/"/g,'href="./"');
 if(file.endsWith('.html')){
  content=content.replace('<script src="analytics.js"></script>','');
  content=content.replace('</footer>','<p>© 2026 sistema-io · <a href="https://github.com/IRMA-io/atles-eines-collectives/blob/main/LICENSE">Autoria i condicions d’ús no comercial</a></p></footer>');
 }
 fs.writeFileSync(output+'/'+file,content);
}
fs.copyFileSync('LICENSE',output+'/LICENSE.txt');
fs.writeFileSync(output+'/.nojekyll','');
console.log('GitHub Pages ready in '+output+'; relative links; no analytics backend.');
