import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const hash=b=>createHash('sha256').update(b).digest('hex');
const expected=['Organize o que hoje está espalhado.','Automatize o que se repete.','Construa apenas o que faz sentido.'];
async function setup(options={}){
 const context=await browser.newContext({viewport:{width:options.width||1440,height:900},hasTouch:true,reducedMotion:options.reduced?'reduce':'no-preference'});
 if(options.network)await context.addInitScript(value=>Object.defineProperty(navigator,'connection',{value:Object.assign(new EventTarget(),value)}),options.network);
 let releaseChunk;
 const gate=new Promise(resolve=>{releaseChunk=resolve;});
 if(options.chunk)await context.route('**/*StoryScene*.js',async route=>{
   const response=await route.fetch();const body=await response.text();
   // Turbopack's tiny dynamic-import proxy is part of hydration, not the 3D payload.
   if(body.includes('function Composition(')){
     if(options.chunk==='fail'){await route.abort();return;}
     await gate;
   }
   await route.fulfill({response,body});
 });
 if(options.noGL)await context.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:get.call(this,type,...args);};});
 await context.addInitScript(()=>{window.__draws=0;const clear=WebGL2RenderingContext.prototype.clear;WebGL2RenderingContext.prototype.clear=function(...args){window.__draws++;return clear.apply(this,args);};});
 const page=await context.newPage();
 await page.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-entry-intro] button').click();
 await page.locator('[data-entry-intro]').waitFor({state:'detached'});
 await page.evaluate(()=>window.__texts=[...document.querySelectorAll('#sobre h2')]);
 return {page,context,releaseChunk};
}
async function go(page,p,delay=700){await page.locator('#sobre').evaluate((el,p)=>scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(delay);}
try{
 for(const width of (process.env.KAIROS_TEST_GROUP==='chunks'?[]:[1440,390])){
  const {page,context}=await setup({width});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await go(page,.2,1600);await page.locator('#sobre [data-scene=webgl]').waitFor();
  await page.waitForTimeout(500);
  const baseline=hash(await page.locator('#sobre canvas').screenshot());
  for(const p of [.2,.345,.365,.38,.5,.645,.665,.68,.82,.5,.2]){
    await go(page,p);
    assert.ok(await page.evaluate(()=>window.__texts.every((n,i)=>n===document.querySelectorAll('#sobre h2')[i])));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const data=await page.locator('#sobre').evaluate(el=>[...el.querySelectorAll('h2')].map(h=>({text:h.textContent,opacity:Number(getComputedStyle(h.parentElement).opacity),stack:getComputedStyle(h.parentElement.parentElement).zIndex})));
    if(p===.345||p===.365)console.log('Wipe boundary',width,p,JSON.stringify(data));
    assert.deepEqual(data.map(d=>d.text),expected);
    if([.2,.5,.82].includes(p))assert.equal(data.filter(d=>d.opacity>.98).length,1);
    if(process.env.KAIROS_CAPTURE_DIR&&[.2,.345,.365,.645,.665,.82].includes(p))await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/wipes-${width}-${p}.png`});
  }
  await page.waitForTimeout(1600);
  if(width===390)assert.equal(hash(await page.locator('#sobre canvas').screenshot()),baseline,'Reverse geometry');
  const draws=await page.evaluate(()=>window.__draws);await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>window.__draws),draws,'No idle render loop');
  // Continuous low-speed progress, then an immediate fast traversal and return.
  for(let p=.32;p<=.42;p+=.002)await go(page,p,25);
  await go(page,.8,800);await go(page,.2,800);
  await page.mouse.move(width/2,450);const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,120);await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>scrollY)>before);
  await page.setViewportSize({width:width===390?430:1280,height:780});await go(page,.5,800);
  const cdp=await context.newCDPSession(page);
  const touchBefore=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width/2,y:600}]});
  for(const y of [550,500,450,400])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width/2,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(400);
  assert.ok(await page.evaluate(()=>scrollY)>touchBefore,'Native touch scroll');await cdp.detach();
  await page.locator('#projetos').scrollIntoViewIfNeeded();await page.waitForTimeout(900);const off=await page.evaluate(()=>window.__draws);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.__draws),off);
  await go(page,.5,800);await page.locator('#sobre canvas').evaluate(el=>el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('#sobre [data-scene=fallback]').waitFor();assert.equal(await page.locator('#sobre canvas').count(),0);
  assert.deepEqual(errors,[]);console.log('3D, native/reverse/slow/fast/resize/idle/context loss:',width,'OK');await context.close();
 }
 for(const options of (process.env.KAIROS_TEST_GROUP==='chunks'?[]:[{network:{saveData:true,effectiveType:'4g'}},{network:{effectiveType:'2g'}},{network:{effectiveType:'slow-2g'}},{reduced:true},{noGL:true}])){
  const {page,context}=await setup(options);await go(page,.5,1000);
  assert.equal(await page.locator('#sobre [data-scene=fallback]').count(),1);
  assert.equal(await page.locator('#sobre canvas').count(),0);
  for(const p of [.2,.37,.5,.67,.82])await go(page,p,350);
  if(options.reduced)assert.equal(await page.locator('#sobre [data-wipe]').count(),0);
  assert.equal(await page.locator('#sobre h2').count(),3);console.log('Fallback:',JSON.stringify(options),'OK');await context.close();
 }
 for(const chunk of ['delay','fail']){
  const {page,context,releaseChunk}=await setup({chunk});
  await go(page,.37,1200);
  assert.equal(await page.locator('#sobre [data-scene=fallback]').count(),1);
  const height=await page.locator('#sobre').evaluate(el=>el.offsetHeight);
  if(chunk==='delay'){
    releaseChunk();await page.locator('#sobre canvas').waitFor();await page.waitForTimeout(600);
    assert.equal(await page.locator('#sobre [data-scene=fallback]').count(),1,'No promotion during wipe');
    await go(page,.5,1600);await page.locator('#sobre [data-scene=webgl]').waitFor();
  }else{await go(page,.5,1200);assert.equal(await page.locator('#sobre canvas').count(),0);}
  assert.equal(await page.locator('#sobre').evaluate(el=>el.offsetHeight),height);
  console.log('3D chunk',chunk,'/ safe promotion / stable layout: OK');releaseChunk();await context.close();
 }
}finally{await browser.close();}
