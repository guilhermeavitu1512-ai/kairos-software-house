import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.KAIROS_URL||'http://localhost:3000/');
  await page.locator('[data-hero-entrance=prepared]').waitFor();
  await page.evaluate(()=>{
   window.overlapSeen=false;
   const stage=document.querySelector('[data-hero-entrance]');
   new MutationObserver(()=>{if(stage.dataset.heroEntrance==='running'&&document.querySelector('[data-entry-intro]'))window.overlapSeen=true;}).observe(stage,{attributes:true,attributeFilter:['data-hero-entrance']});
  });
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached',timeout:20000});
  await page.locator('[data-hero-entrance=complete]').waitFor();
  assert.ok(await page.evaluate(()=>window.overlapSeen),'Reveal overlaps intro');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForTimeout(250);
  const start=await page.locator('#hero-title').boundingBox();
  for(const y of [80,160,240,360]) {
   await page.evaluate(y=>scrollTo(0,y),y);
   await page.waitForTimeout(250);
   const result=await page.evaluate(()=>{
    const title=document.querySelector('#hero-title');const story=document.querySelector('#sobre');
    const inner=document.querySelector('[data-hero-exit]');
    return {top:title.getBoundingClientRect().top,opacity:Number(getComputedStyle(inner).opacity),masks:[...title.querySelectorAll('[data-hero-word]')].map(n=>getComputedStyle(n).clipPath),story:Number(story.style.getPropertyValue('--arrival-alpha')),arrival:parseFloat(story.style.getPropertyValue('--arrival-copy-y')),scroll:scrollY};
   });
   assert.ok(Math.abs(result.top-start.y)<=31,'Heading remains one stable block');
   assert.ok(result.masks.every(mask=>mask==='none'),'No exit masks');
   assert.ok(result.arrival>=0&&result.arrival<=18,'Incoming copy travels at most 18px');
   assert.equal(result.scroll,y);
   if(y===160)assert.ok(result.story>0,'Memphis appears before handoff ends');
   if(y===160||y===360)await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/handoff-${width}-${y}.png`});
  }
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
  assert.equal(await page.locator('[data-hero-exit]').evaluate(n=>getComputedStyle(n).opacity),'1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('#sobre').style.getPropertyValue('--arrival-copy-y')==='0px');
  assert.deepEqual(errors,[]);console.log('Handoff',width,'overlap, grouped exit, masks, native scroll, return, reduced OK');
  await page.close();
 }
} finally {await browser.close();}
