import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {activeChapter} from '../components/kairos/story-timeline.ts';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const output=process.env.KAIROS_CAPTURE_DIR||'outputs';
await mkdir(output,{recursive:true});
const copy=['Seus serviços, fáceis de encontrar.','Pedidos e agenda, no mesmo lugar.','Menos tarefas feitas à mão.'];
try{
 for(const options of (process.env.KAIROS_REDUCED_ONLY?[{width:390,reduced:true}]:[{width:1440},{width:390},{width:1440,fallback:true},{width:390,fallback:true},{width:390,reduced:true}])){
  const page=await browser.newPage({viewport:{width:options.width,height:900},reducedMotion:options.reduced?'reduce':'no-preference'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  if(options.fallback)await page.addInitScript(()=>{
   const get=HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:get.call(this,type,...args);};
  });
  await page.goto(process.env.KAIROS_TEST_URL||'http://127.0.0.1:3100/');
  await page.locator('#sobre[data-enhanced=true]').waitFor();
  const intro=page.locator('[data-entry-intro] button');
  if(await intro.count())await intro.click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached'});
  const go=async p=>{
   await page.locator('#sobre').evaluate((el,p)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);
   await page.waitForTimeout(180);
  };
  await go(.2);
  await page.locator(`#sobre [data-scene=${options.fallback||options.reduced?'fallback':'webgl'}]`).waitFor();
  await page.waitForTimeout(500);
  for(const p of [.2,.30,.359,.361,.42,.52,.62,.679,.681,.74,.84,.69,.52,.37,.2]){
   await go(p);
   await page.waitForFunction(expected=>[...document.querySelectorAll('#sobre h2')].some(n=>Number(getComputedStyle(n.parentElement).opacity)>.99&&n.textContent===expected),copy[activeChapter(p)]);
   const visible=await page.locator('#sobre h2').evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n.parentElement).opacity)>.99).map(n=>n.textContent));
   assert.deepEqual(visible,[copy[activeChapter(p)]],'One stable heading, including reverse scrolling');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('[data-nextjs-dialog]').count(),0,JSON.stringify({errors,overlay:await page.locator('[data-nextjs-dialog]').allTextContents()}));
   if(options.fallback&&[.359,.361,.679,.681].includes(p)){
    const index=p<.5?0:1;
    const fullyCovered=await page.locator(`[data-vector-wipe="${index}"] > *`).evaluate(shape=>{
     const inverse=shape.getScreenCTM().inverse();
     const rect=shape.ownerSVGElement.getBoundingClientRect();
     for(let x=0;x<=10;x++)for(let y=0;y<=10;y++){
      const pt=new DOMPoint(rect.left+1+(rect.width-2)*x/10,rect.top+1+(rect.height-2)*y/10).matrixTransform(inverse);
      if(!shape.isPointInFill(pt)&&!shape.isPointInStroke(pt))return false;
     }
     return true;
    });
    assert.ok(fullyCovered,'SVG covers the full viewport during the copy swap');
   }
   if([.30,.361,.42,.52].includes(p)&&!options.reduced)await page.screenshot({path:`${output}/memphis-${options.width}-${options.fallback?'svg':'3d'}-${p}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('Memphis entrance, coverage, exit, reverse and page errors:',JSON.stringify(options),'OK');
  await page.close();
 }
}finally{await browser.close();}
