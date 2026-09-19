import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readdirSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),{chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const folder=process.env.KAIROS_CAPTURE_DIR,url=process.env.KAIROS_URL||'http://127.0.0.1:3100/';
const chunks=readdirSync('.next/static/chunks').filter(n=>n.endsWith('.js')&&readFileSync(`.next/static/chunks/${n}`,'utf8').includes('foregroundArc'));
assert.ok(chunks.length,'Locate actual lazy 3D production chunks');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const shot=async(page,name)=>page.screenshot({path:`${folder}/${name}.png`});
const go=async(page,p)=>{await page.locator('#sobre').evaluate((el,p)=>scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(300);};
const hash=b=>createHash('sha256').update(b).digest('hex');
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},recordVideo:{dir:folder,size:{width,height:900}}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.locator('[data-hero-entrance=prepared]').waitFor();
  await shot(page,`opening-${width}-01-idle`);
  await page.locator('[data-entry-intro] button').press(width===1440?'Enter':'Space');
  await page.waitForTimeout(500);await shot(page,`opening-${width}-02-cover`);
  await page.locator('[data-entry-intro]').waitFor({state:'detached'});
  await shot(page,`opening-${width}-03-reveal`);
  await page.locator('[data-hero-entrance=complete]').waitFor();
  await page.waitForTimeout(750);await shot(page,`opening-${width}-04-hero`);
  assert.equal(await page.locator('[data-entry-intro],[data-copy]').count(),0);
  assert.equal(await page.locator('#hero-title').count(),1);
  assert.equal(await page.locator('#inicio').getByRole('link').count(),1);
  await page.evaluate(()=>scrollTo(0,160));await page.waitForTimeout(200);await shot(page,`opening-${width}-05-handoff`);
  await go(page,.12);await page.locator('#sobre [data-scene=webgl]').waitFor({timeout:30000});await page.waitForTimeout(500);
  await shot(page,`opening-${width}-06-organize`);
  for(const [i,start]of [[0,.25],[1,.57]]){
   for(const local of [.25,.5,.75,.9,.96,1]){
    await go(page,start+.2*local);
    assert.equal(await page.locator('#sobre h2').count(),1);
    await shot(page,`opening-${width}-wipe${i}-${local}`);
    if(local===.9){
     // Force HTML fully opaque: identical glyph pixels prove real occlusion.
     const style=await page.addStyleTag({content:'#sobre [data-live-copy]{opacity:1!important}'});
     const box=await page.locator('#sobre h2').boundingBox();
     const clip={x:Math.floor(box.x),y:Math.floor(box.y),width:Math.ceil(box.width),height:Math.ceil(box.height)};
     const shown=await page.screenshot({clip});
     const hiddenStyle=await page.addStyleTag({content:'#sobre h2{visibility:hidden!important}'});
     const hidden=await page.screenshot({clip});
     await hiddenStyle.evaluate(el=>el.remove());await style.evaluate(el=>el.remove());
     assert.equal(hash(shown),hash(hidden),`physical coverage ${width} wipe ${i}`);
    }
   }
   await go(page,start+.2*.905);assert.equal(await page.locator('#sobre h2').getAttribute('data-chapter'),String(i));
   await go(page,start+.2*.915);assert.equal(await page.locator('#sobre h2').getAttribute('data-chapter'),String(i+1));
   await go(page,start+.2*.905);assert.equal(await page.locator('#sobre h2').getAttribute('data-chapter'),String(i));
  }
  await go(page,.85);await shot(page,`opening-${width}-12-construa`);
  // Slow, fast and reverse native scroll; then rest without extra DOM copies.
  await page.evaluate(async()=>{const s=document.querySelector('#sobre');const base=s.offsetTop,range=s.offsetHeight-innerHeight;for(let p=.85;p>.8;p-=.002){scrollTo(0,base+range*p);await new Promise(requestAnimationFrame);}});
  await go(page,.1);await go(page,.95);await page.waitForTimeout(1200);
  assert.equal(await page.locator('#sobre h2').count(),1);
  await page.setViewportSize({width:width+30,height:820});await go(page,.5);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#lab-title').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  assert.equal(await page.locator('#lab-title').count(),1);
  assert.ok(await page.locator('#sobre').evaluate(el=>el.getBoundingClientRect().bottom<=document.querySelector('#lab-title').getBoundingClientRect().top));
  assert.deepEqual(errors,[]);console.log('Production opening:',width,'frames, physical coverage, reverse, rest, resize, Lab boundary OK');
  await context.close();
 }
 for(const mode of ['webgl-off','import-failure','delayed-chunk','saveData','2g','reduced']){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  if(mode==='webgl-off')await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};});
  if(mode==='saveData'||mode==='2g')await context.addInitScript(mode=>{Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{saveData:mode==='saveData',effectiveType:mode==='2g'?'2g':'4g'})});},mode);
  let hits=0,release;
  const delayed=new Promise(resolve=>{release=resolve;});
  if(mode==='import-failure'||mode==='delayed-chunk')await context.route('**/_next/static/chunks/*.js',async route=>{
   if(!chunks.some(n=>route.request().url().endsWith(n)))return route.continue();
   hits++;if(mode==='import-failure')return route.abort();
   await delayed;await route.continue();
  });
  const page=await context.newPage();await page.goto(url);await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached'});await page.locator('[data-hero-entrance=complete]').waitFor();
  for(const p of [.1,.43,.5,.75,.85]){await go(page,p);assert.ok(await page.locator('#sobre [data-story-fallback]').isVisible());}
  await shot(page,`opening-resilience-${mode}`);
  assert.equal(await page.locator('#sobre [data-scene]').getAttribute('data-scene'),'fallback');
  assert.equal(await page.locator('#sobre [data-scene]').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('#sobre').getByText(/Prévia visual em breve|carregando/i).count(),0);
  if(mode.includes('chunk')||mode==='import-failure')assert.ok(hits>0,'Injected actual lazy-chunk condition');
  if(mode==='delayed-chunk'){release();await go(page,.5);await page.locator('#sobre [data-scene=webgl]').waitFor({timeout:30000});}
  await context.close();console.log('Production resilience:',mode,'OK');
 }
}finally{await browser.close();}
