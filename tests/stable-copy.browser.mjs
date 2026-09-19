import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/');
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-hero-entrance=complete]').waitFor();
  const read=()=>page.locator('[data-hero-exit]').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform,support:getComputedStyle(el.querySelector('[data-hero-support]')).opacity,cta:getComputedStyle(el.querySelector('[data-hero-action-exit]')).opacity}));
  const initial=await read();
  for(const y of [100,250,450,200,0]){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(150);
   assert.deepEqual(await read(),initial,'Text stays at its document position without opacity changes');
  }
  assert.equal(initial.opacity,'1');assert.equal(initial.transform,'none');
  assert.equal(await page.locator('#sobre').getAttribute('data-handoff'),null);
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/stable-${width}-hero.png`});
  for(const p of [.12,.43,.44,.46,.5,.76,.78,.8,.12]){
   await page.locator('#sobre').evaluate((el,p)=>scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);
   await page.waitForTimeout(250);
   assert.equal(await page.locator('#sobre h2').count(),1);
   assert.equal(await page.locator('[data-live-copy]').evaluate(el=>getComputedStyle(el).opacity),'1');
  }
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/stable-${width}-story.png`});
  assert.deepEqual(errors,[]);console.log('Stable copy',width,'native scroll, no fade, no text parallax, reverse OK');await page.close();
 }
}finally{await browser.close();}
