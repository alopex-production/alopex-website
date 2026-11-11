import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const args=process.argv.slice(2);
if(args.some(arg=>arg!=='--preview'))throw new Error('Unknown build option');
const preview=args.includes('--preview')||(process.env.CF_PAGES==='1'&&process.env.CF_PAGES_BRANCH!=='main');
const excluded=new Set(JSON.parse(fs.readFileSync(path.join(root,'public-exclusions.json'),'utf8')).paths);
const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const excludedHashes=new Set([...excluded].map(n=>digest(path.join(root,n))));
const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const allowed=new Set(['.html','.css','.js','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.xml']);
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
let copied=0;
for(const name of files){
 if(excluded.has(name)||name.startsWith('.')||name.startsWith('scripts/')||name.startsWith('dist/'))continue;
 if(!allowed.has(path.extname(name).toLowerCase())&&!['robots.txt','_headers','_redirects'].includes(name))continue;
 const from=path.join(root,name),to=path.join(out,name);
 if(excludedHashes.has(digest(from)))continue;
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);copied++;
}
for(const name of excluded){if(fs.existsSync(path.join(out,name)))throw new Error('Excluded material present: '+name);}
for(const required of ['index.html','about.html','production.html','web.html','people.html','motozumi.html','sitemap.xml','robots.txt','_redirects']){
 if(!fs.existsSync(path.join(out,required)))throw new Error('Missing required output: '+required);
}
if(preview){
 for(const name of files.filter(name=>name.endsWith('.html')&&fs.existsSync(path.join(out,name)))){
  const file=path.join(out,name);
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi,'');
  html=html.replace(/<\/head>/i,'<meta name="robots" content="noindex,follow"/></head>');
  fs.writeFileSync(file,html);
 }
 fs.appendFileSync(path.join(out,'_headers'),'\n/*\n  X-Robots-Tag: noindex\n');
}
console.log(JSON.stringify({output:'dist',mode:preview?'preview':'production',files:copied+(preview?1:0),excluded:[...excluded]}));
