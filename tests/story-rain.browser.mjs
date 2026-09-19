import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,ignoreDefaultArgs:['--hide-scrollbars'],args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const folder=process.env.KAIROS_CAPTURE_DIR;
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000/');await page.locator('[data-entry-intro] button').click();await page.locator('[data-entry-intro]').waitFor({state:'detached'});
  const section=page.locator('#sobre');
  const go=async p=>{await section.evaluate((el,p)=>scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(1300);};
  await go(.15);await page.locator('#sobre [data-scene=webgl]').waitFor();await page.waitForTimeout(500);
  if(folder)await page.screenshot({path:`${folder}/rain-${width}-calm.png`});
  for(const [index,stops]of [[0,[.46,.57,.7,.74,.84,.92]],[1,[.57,.675,.705,.735,.84,.92]]]){
   for(const t of stops){
    await go((index===0?.25:.57)+.2*t);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if(folder)await page.screenshot({path:`${folder}/rain-${width}-wipe${index}-${t}.png`});
   }
   // Reverse before completion and return to the exact earlier progress.
   await go((index===0?.25:.57)+.2*.6);await go((index===0?.25:.57)+.2*.4);
  }
  if(width===1440){
   await go(.25);
   const metrics=await page.evaluate(()=>({height:innerHeight,total:document.documentElement.scrollHeight,y:scrollY}));
   const thumb=Math.max(24,metrics.height*metrics.height/metrics.total),top=metrics.y/(metrics.total-metrics.height)*(metrics.height-thumb);
   await page.mouse.move(width-5,top+thumb/2);await page.waitForTimeout(200);await page.mouse.down();
   for(let d=1;d<=20;d++){await page.mouse.move(width-5,top+thumb/2+d);await page.waitForTimeout(60);}
   const down=await page.evaluate(()=>scrollY);assert.ok(down>metrics.y);
   for(let d=19;d>=10;d--){await page.mouse.move(width-5,top+thumb/2+d);await page.waitForTimeout(60);}
   await page.mouse.up();assert.ok(await page.evaluate(()=>scrollY)<down,'Reversal while dragging');
  }
  assert.deepEqual(errors,[]);console.log('Rain density, progressive surface captures, reverse and native scrollbar:',width,'OK');await page.close();
 }
}finally{await browser.close();}
