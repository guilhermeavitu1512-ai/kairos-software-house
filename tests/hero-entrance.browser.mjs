import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 for(const [width,reduced,earlyScroll] of [[1440,false,false],[390,false,true],[320,true,false]]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.KAIROS_URL||'http://localhost:3000/');
  await page.locator('[data-hero-entrance=prepared]').waitFor();
  await page.evaluate(()=>{
   window.originalHero=document.querySelector('#hero-title');
   window.entranceStates=[];
   const stage=document.querySelector('[data-hero-entrance]');
   new MutationObserver(()=>window.entranceStates.push({state:stage.dataset.heroEntrance,at:performance.now(),opacity:getComputedStyle(document.querySelector('[data-hero-word]')).opacity})).observe(stage,{attributes:true,attributeFilter:['data-hero-entrance']});
  });
  assert.equal(await page.locator('#hero-title').count(),1);
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached',timeout:20000});
  if(earlyScroll)await page.evaluate(()=>scrollTo(0,180));
  await page.locator('[data-hero-entrance=complete]').waitFor({timeout:20000});
  assert.ok(await page.evaluate(()=>window.originalHero===document.querySelector('#hero-title')));
  const states=await page.evaluate(()=>window.entranceStates);
  assert.ok(states.some(s=>s.state==='running' && Number(s.opacity)<1),'Reveal begins unfinished');
  assert.ok(states.some(s=>s.state==='complete'));
  assert.ok(await page.locator('[data-hero-word]').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).clipPath==='none'&&getComputedStyle(n).opacity==='1')));
  assert.equal(await page.locator('#inicio').getByRole('link').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/entrance-${width}.png`});
  await page.setViewportSize({width:width+40,height:800});
  assert.ok(await page.locator('#hero-title').isVisible());
  assert.deepEqual(errors,[]);
  console.log('Entrance',width,{reduced,earlyScroll,states});
  await page.close();
 }
 const page=await browser.newPage({javaScriptEnabled:false});
 await page.goto(process.env.KAIROS_URL||'http://localhost:3000/');
 assert.ok(await page.locator('#hero-title').isVisible());
 await page.close();
} finally {await browser.close();}
