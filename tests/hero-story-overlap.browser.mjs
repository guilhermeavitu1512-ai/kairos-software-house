import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,ignoreDefaultArgs:['--hide-scrollbars'],args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const url=process.env.KAIROS_URL||'http://127.0.0.1:3100/';
const sample=page=>page.evaluate(()=>{
 const stage=document.querySelector('[data-transition-span]'),story=document.querySelector('#sobre'),title=document.querySelector('#hero-title');
 return {t:Number(stage.dataset.transitionProgress),span:Number(stage.dataset.transitionSpan),heading:Number(getComputedStyle(document.querySelector('[data-hero-exit]')).opacity),scene:Number(story.style.getPropertyValue('--arrival-alpha')),copy:Number(story.style.getPropertyValue('--arrival-copy')),y:parseFloat(story.style.getPropertyValue('--arrival-copy-y')),top:title.getBoundingClientRect().top,masks:[...title.querySelectorAll('[data-hero-word]')].map(n=>getComputedStyle(n).clipPath),scroll:scrollY};
});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.locator('[data-hero-entrance=prepared]').waitFor();
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-hero-entrance=complete]').waitFor();
  await page.waitForTimeout(700);
  const initial=await sample(page),history=new Map();
  assert.equal(initial.heading,1);assert.equal(initial.scene,0);
  for(const t of [0,.2,.35,.5,.65,.8,1,.8,.65,.5,.35,.2,0]){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),initial.span*t);
   await page.waitForFunction(t=>Math.abs(Number(document.querySelector('[data-transition-progress]').dataset.transitionProgress)-t)<.005,t);
   const state=await sample(page);
   assert.ok(Math.abs(state.t-t)<.005,JSON.stringify({width,t,initial,state}));assert.ok(Math.abs(state.top-initial.top)<=29);
   assert.ok(state.masks.every(m=>m==='none'));
   assert.ok(state.y>=0&&state.y<=18);
   assert.ok(state.heading+state.copy>.35,'No empty handoff');
   if(t===.35)assert.ok(state.heading>.99&&state.scene>0);
   if(t===.65)assert.ok(state.heading>.4&&state.heading<.6&&state.copy>0&&state.scene>0);
   if(t===1)assert.equal(state.copy,1);
   if(history.has(t))assert.deepEqual(state,history.get(t),'Exact reverse at rest');
   else{history.set(t,state);if([.35,.65,.8,1].includes(t))await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/overlap-${width}-${t}.png`});}
  }
  assert.equal(await page.locator('#hero-title').count(),1);assert.equal(await page.locator('#sobre h2').count(),1);
  // A slow native scroll stream, then fast wheel and exact return.
  await page.evaluate(async span=>{for(let y=0;y<=span;y+=3){scrollTo({top:y,behavior:'instant'});await new Promise(requestAnimationFrame);}},initial.span);
  await page.mouse.move(width/2,450);await page.mouse.wheel(0,1300);
  try{await page.waitForFunction(span=>scrollY>span,initial.span,{timeout:10000});}catch(error){console.log(await page.evaluate(()=>({scroll:scrollY,html:document.documentElement.style.cssText,body:document.body.style.cssText,hover:document.elementFromPoint(innerWidth/2,450)?.outerHTML.slice(0,500)})));throw error;}
  assert.ok((await sample(page)).scroll>initial.span);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);assert.equal((await sample(page)).heading,1);
  // Drag the native scrollbar where the browser exposes a non-overlay gutter.
  const scrollbar=await page.evaluate(()=>({gutter:innerWidth-document.documentElement.clientWidth,height:innerHeight,doc:document.documentElement.scrollHeight}));
  if(scrollbar.gutter>0){
   const x=width-scrollbar.gutter/2,thumb=scrollbar.height**2/scrollbar.doc;
   await page.mouse.move(x,thumb/2);await page.mouse.down();
   await page.mouse.move(x,thumb/2+initial.span*.7/scrollbar.doc*scrollbar.height,{steps:24});await page.mouse.up();
   await page.waitForTimeout(250);assert.ok((await sample(page)).scroll>20,'Scrollbar drag changes native progress');
  }
  await page.setViewportSize({width:width+25,height:820});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const resized=await sample(page);assert.equal(resized.heading,1);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);
  await page.evaluate(y=>scrollTo(0,y),resized.span*.65);await page.waitForTimeout(250);
  const reduced=await sample(page);assert.equal(reduced.y,0);assert.ok(reduced.heading>0&&reduced.copy>0);
  assert.deepEqual(errors,[]);console.log('Overlap',width,JSON.stringify(history.get(.65)),'reverse, wheel, scrollbar, resize, reduced OK');
  await page.close();
 }
}finally{await browser.close();}
