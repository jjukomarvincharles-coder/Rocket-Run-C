// Copies Three.js into www/vendor so the APK works fully OFFLINE, and points index.html at the local copy.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'three');
const dst = path.join(root, 'www', 'vendor', 'three');
if (!fs.existsSync(src)) { console.error('three not installed — run "npm install" first'); process.exit(1); }
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(path.join(dst, 'build'), { recursive: true });
fs.copyFileSync(path.join(src, 'build', 'three.module.js'), path.join(dst, 'build', 'three.module.js'));
fs.cpSync(path.join(src, 'examples', 'jsm'), path.join(dst, 'examples', 'jsm'), { recursive: true });
const idx = path.join(root, 'www', 'index.html');
let html = fs.readFileSync(idx, 'utf8');
const a = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const b = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/';
if (!html.includes(a) || !html.includes(b)) { console.error('importmap URLs not found in www/index.html'); process.exit(1); }
html = html.replace(a, './vendor/three/build/three.module.js').replace(b, './vendor/three/examples/jsm/');
fs.writeFileSync(idx, html);
const capPackages=['@capacitor/core','@capacitor/app'];
for(const name of capPackages){
 const esm=path.join(root,'node_modules',name,'dist','esm');
 if(!fs.existsSync(esm)){console.error('Missing '+name+' ESM files — run npm install');process.exit(1);}
 const target=path.join(root,'www','vendor',name.replace('@capacitor/','capacitor-'));
 fs.rmSync(target,{recursive:true,force:true});fs.mkdirSync(target,{recursive:true});fs.cpSync(esm,target,{recursive:true});
}
const appIdx=path.join(root,'www','index.html');let appHtml=fs.readFileSync(appIdx,'utf8');
appHtml=appHtml.replace('https://cdn.jsdelivr.net/npm/@capacitor/core@6.1.0/dist/esm/index.js','./vendor/capacitor-core/index.js');
appHtml=appHtml.replace('https://cdn.jsdelivr.net/npm/@capacitor/app@6.0.0/dist/esm/index.js','./vendor/capacitor-app/index.js');
fs.writeFileSync(appIdx,appHtml);
console.log('Three.js and Capacitor App/Core vendored for offline Android operation.');
