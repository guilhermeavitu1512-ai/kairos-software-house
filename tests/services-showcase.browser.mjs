import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({executablePath:process.env.KAIROS_BROWSER});
try{for(const width of [1440,820,390]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.KAIROS_TEST_URL||'http://127.0.0.1:3102/');const section=page.locator('#servicos');await section.scrollIntoViewIfNeeded();
 const tabs=section.getByRole('tab');await tabs.first().focus();
 for(let i=0;i<4;i++){
  if(i)await page.keyboard.press('ArrowRight');
  assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true');
  assert.equal(await section.getByRole('tabpanel').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await section.screenshot({path:`outputs/services-${width}-${i}.png`});
 }
 await page.keyboard.press('Home');assert.equal(await tabs.first().getAttribute('aria-selected'),'true');
 await page.keyboard.press('End');assert.equal(await tabs.last().getAttribute('aria-selected'),'true');
 await section.getByRole('tabpanel').getByRole('link',{name:'Contar meu problema'}).click();
 const dialog=page.locator('dialog');await dialog.waitFor({state:'visible'});assert.match(await dialog.innerText(),/Interesse: Bots & Automações/);
 await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.deepEqual(errors,[]);
 console.log('Services tabs, keyboard, context, overflow',width,'OK');await page.close();
}}finally{await browser.close();}
