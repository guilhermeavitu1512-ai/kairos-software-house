import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.KAIROS_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({headless:true, executablePath:process.env.KAIROS_BROWSER, args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page = await browser.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('http://localhost:3000/?test=story-scene');
    const section=page.locator('#sobre');
    const captures=[];
    for(const phase of [.12,.52,.94,.12]) {
      await section.evaluate((el,p)=>scrollTo(0,el.offsetTop+(el.offsetHeight-innerHeight)*p),phase);
      await page.locator('#sobre [data-scene="webgl"]').waitFor();
      await page.waitForTimeout(1800);
      const canvas=page.locator('#sobre canvas');
      captures.push(await canvas.screenshot());
      if(process.env.KAIROS_CAPTURE_DIR) await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/story-3d-${width}-${phase}.png`});
      assert.equal(await section.locator('img,image').count(),0);
    }
    assert.notDeepEqual(captures[0],captures[1],'Scene must evolve with scroll');
    assert.deepEqual(captures[0],captures[3],'Scene must be reversible');
    const stationary=await page.locator('#sobre canvas').screenshot();
    await page.waitForTimeout(400);
    assert.deepEqual(stationary,await page.locator('#sobre canvas').screenshot(),'Scene must settle');
    console.log('3D forward/reverse/idle:',width,'OK');
  }
  await page.locator('#sobre canvas').evaluate(el=>el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('#sobre [data-scene="fallback"]').waitFor();
  assert.equal(await page.locator('#sobre canvas').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#sobre canvas').count(),0);
  assert.deepEqual(errors,[]);
  console.log('Context loss fallback / reduced motion / runtime: OK');
} finally {await browser.close();}
