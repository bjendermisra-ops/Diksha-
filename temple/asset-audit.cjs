#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),site=path.join(root,'temple');
const pages=['index.html','about/index.html','contact/index.html','katha25/index.html','gita-mahayagna/index.html','dc/index.html','dindi/index.html','prabhupada-prasad/index.html'];
const issues=[],assets=new Set();
function checkFile(url,from){if(!url.startsWith('/'))return;const clean=url.split('?')[0].split('#')[0];if(!/\.(svg|webp|png|jpe?g|css|js|woff2?)$/i.test(clean))return;const file=path.resolve(root,'.'+clean);if(!file.startsWith(root)||!fs.existsSync(file))issues.push(from+': missing '+url);else assets.add(clean);}
for(const p of pages){const file=path.join(site,p);if(!fs.existsSync(file)){issues.push('missing page '+p);continue;}const s=fs.readFileSync(file,'utf8');for(const m of s.matchAll(/(?:src|href)=["']([^"']+)["']/g))checkFile(m[1],p);if(!s.includes('/temple/atelier.css'))issues.push(p+': no unified stylesheet');}
for(const cssName of ['atelier.css','premium.css','temple.css']){let file=path.join(site,cssName);if(!fs.existsSync(file))continue;let s=fs.readFileSync(file,'utf8');for(const m of s.matchAll(/url\(['"]?([^'")]+)['"]?\)/g))checkFile(m[1],cssName);}
const webps=fs.readdirSync(path.join(site,'assets')).filter(n=>n.endsWith('.webp'));
if(webps.length<17)issues.push('Missing photographic image files: found '+webps.length);
console.log('Checked '+pages.length+' pages; '+assets.size+' local asset references; '+webps.length+' WebP photos');
if(issues.length){console.error(issues.join('\n'));process.exit(1)}console.log('PASS: all local images, CSS and JS references exist');
