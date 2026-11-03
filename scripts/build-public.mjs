import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const excluded=new Set(JSON.parse(fs.readFileSync(path.join(root,'public-exclusions.json'),'utf8')).paths);
const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const excludedHashes=new Set([...excluded].map(n=>digest(path.join(root,n))));
const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const allowed=new Set(['.html','.css','.js','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.xml']);
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
let copied=0;
for(const name of files){
 if(excluded.has(name)||name.startsWith('.')||name.startsWith('scripts/'))continue;
 if(!allowed.has(path.extname(name).toLowerCase())&&!['robots.txt','_headers','_redirects'].includes(name))continue;
 const from=path.join(root,name),to=path.join(out,name);
 if(excludedHashes.has(digest(from)))continue;
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);copied++;
}
for(const name of excluded){if(fs.existsSync(path.join(out,name)))throw new Error('Excluded material present: '+name);}
for(const required of ['index.html','production.html','web.html','people.html','motozumi.html','sitemap.xml','_redirects']){
 if(!fs.existsSync(path.join(out,required)))throw new Error('Missing required output: '+required);
}
console.log(JSON.stringify({output:'dist',files:copied,excluded:[...excluded]}));
