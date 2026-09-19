import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/contato','/projetos','/projetos/vyne','/sobre']){
   await page.goto(`http://127.0.0.1:3100${route}`);
   if(route==='/'){
    await page.locator('[data-entry-intro] button').click();
    await page.locator('[data-entry-intro]').waitFor({state:'detached'});
    await page.locator('[data-hero-entrance=complete]').waitFor();
   }
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   const result=await page.evaluate(()=>({loaded:document.fonts.check('400 16px "DM Sans Variable"'),font:getComputedStyle(document.body).fontFamily,heading:getComputedStyle(document.querySelector('h1')).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.ok(result.loaded&&result.font.includes('DM Sans Variable')&&result.heading.includes('DM Sans Variable'),JSON.stringify(result));
   assert.equal(result.overflow,false,`${route} at ${width}`);
   await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/type-${width}-${route.replaceAll('/','_')||'home'}.png`});
   if(route==='/'){
    const pricing=page.locator('#precos');
    if(await pricing.count()){
     await pricing.scrollIntoViewIfNeeded();await page.waitForTimeout(200);
     await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/type-${width}-pricing.png`});
    }
   }
   console.log('Typography',width,route,result);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
