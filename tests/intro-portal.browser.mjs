import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('http://localhost:3000/');
  const intro=page.locator('[data-entry-intro]');await intro.waitFor();
  const initial=await intro.locator('[data-orbit]').getAttribute('transform');
  await page.waitForTimeout(5100);
  assert.notEqual(await intro.locator('[data-orbit]').getAttribute('transform'),initial,'Idle remains alive for five seconds');
  const folder=process.env.KAIROS_CAPTURE_DIR;
  if(folder)await page.screenshot({path:`${folder}/portal-${width}-idle.png`});
  await page.evaluate(()=>{
   window.__portal=[];
   document.querySelector('[data-entry-intro] button').click();
   const start=performance.now();
   const sample=()=>{
    const frame=document.querySelector('[data-frame]'),orbit=document.querySelector('[data-orbit]');
    if(!frame)return;
    window.__portal.push({time:performance.now()-start,width:frame.getBoundingClientRect().width,orbit:orbit.getAttribute('transform'),copy:Number(getComputedStyle(document.querySelector('[data-copy]')).opacity)});
    requestAnimationFrame(sample);
   };sample();
  });
  await page.waitForTimeout(650);
  if(folder)await page.screenshot({path:`${folder}/portal-${width}-opening.png`});
  await intro.waitFor({state:'detached'});
  const samples=await page.evaluate(()=>window.__portal);
  assert.ok(samples.length>8);
  assert.ok(samples.at(-1).width>width);
  assert.ok(samples.filter(s=>s.time<250).every(s=>s.copy>.95),'Name stays visible initially');
  assert.ok(new Set(samples.map(s=>s.orbit)).size>5,'Existing background continues on click');
  console.log('Five-second idle / continuous curves / progressive portal:',width,'OK');
  await page.close();
 }
}finally{await browser.close();}
