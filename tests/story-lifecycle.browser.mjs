import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,ignoreDefaultArgs:['--hide-scrollbars'],args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
await context.addInitScript(()=>{window.__draws=0;const clear=WebGL2RenderingContext.prototype.clear;WebGL2RenderingContext.prototype.clear=function(...args){window.__draws++;return clear.apply(this,args);};});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:3000/');await page.locator('[data-entry-intro] button').tap();await page.locator('[data-entry-intro]').waitFor({state:'detached'});
 await page.locator('#sobre').evaluate(el=>scrollTo(0,el.offsetTop+(el.offsetHeight-innerHeight)*.5));
 await page.locator('#sobre [data-scene=webgl]').waitFor();await page.waitForTimeout(1200);
 const cdp=await context.newCDPSession(page),before=await page.evaluate(()=>scrollY);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:600}]});
 for(const y of [550,500,450,400]){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y}]});await page.waitForTimeout(40);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);assert.ok(await page.evaluate(()=>scrollY)>before);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#sobre canvas').waitFor({state:'detached'});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#sobre').evaluate(el=>scrollTo(0,el.offsetTop+(el.offsetHeight-innerHeight)*.5));await page.locator('#sobre [data-scene=webgl]').waitFor();
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(600);
 // Native scrollbar drag: no script changes scroll position in this step.
 const metrics=await page.evaluate(()=>({height:innerHeight,total:document.documentElement.scrollHeight,y:scrollY}));
 const thumb=Math.max(24,metrics.height*metrics.height/metrics.total);
 const top=metrics.y/(metrics.total-metrics.height)*(metrics.height-thumb);
 await page.mouse.move(1436,top+thumb/2);await page.waitForTimeout(200);await page.mouse.down();await page.mouse.move(1436,top+thumb/2+100,{steps:12});await page.mouse.up();await page.waitForTimeout(300);
 assert.ok(await page.evaluate(()=>scrollY)>metrics.y,'Scrollbar drag must remain native');
 await page.locator('.desktop-nav a[href="/contato"]').click();await page.waitForURL('**/contato');assert.equal(await page.locator('#sobre').count(),0);
 await page.waitForTimeout(800);const draws=await page.evaluate(()=>window.__draws);await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>window.__draws),draws);
 assert.deepEqual(errors,[]);console.log('Touch, preference changes, resize, native scrollbar drag, SPA unmount and cleanup: OK');
}finally{await browser.close();}
