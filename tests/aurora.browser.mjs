import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000/');
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached',timeout:15000});
  assert.equal(await page.locator('[data-hero-aurora] canvas').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-hero-aurora] canvas').waitFor({timeout:15000});
  await page.waitForTimeout(500);
  assert.ok(await page.locator('#hero-title').isVisible());
  assert.equal(await page.locator('#inicio').getByRole('link').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/aurora-${width}.png`});
  await page.evaluate(()=>scrollTo(0,innerHeight*1.3));
  await page.locator('[data-hero-aurora] canvas').waitFor({state:'detached',timeout:15000});
  await page.evaluate(()=>scrollTo(0,0));
  await page.locator('[data-hero-aurora] canvas').waitFor({timeout:15000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-hero-aurora] canvas').waitFor({state:'detached',timeout:15000});
  assert.deepEqual(errors,[]);
  console.log('Aurora',width,'render, scrolling, reduced motion, cleanup OK');
  await page.close();
 }
} finally {await browser.close();}
