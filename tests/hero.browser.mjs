import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT);
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[];
try {
 for(const width of [1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000/');
  await page.locator('[data-entry-intro]').waitFor();
  assert.equal(await page.locator('#hero-title').count(),1);
  await page.locator('[data-entry-intro] button').click();
  await page.locator('[data-entry-intro]').waitFor({state:'detached',timeout:15000});
  await page.locator('[data-hero-ready=true]').waitFor();
  await page.locator('#inicio img').evaluate(img=>img.decode());
  assert.equal(await page.locator('#inicio canvas').count(),0);
  assert.equal(await page.locator('#inicio [data-hero-parallax]').count(),2);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/hero-${width}.png`});
  await page.locator('#inicio').getByRole('link',{name:/Contar meu problema/}).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#inicio').getByText('Ver projetos',{exact:true}).count(),0);
  assert.match(await page.locator('#hero-title').innerText(),/Ainda depende de/);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>scrollTo(0,240));
  await page.waitForTimeout(350);
  const displacement=await page.locator('[data-depth]').evaluateAll(nodes=>nodes.map(n=>new DOMMatrix(getComputedStyle(n).transform).m42));
  assert.ok(displacement[0]>0 && displacement[2]>displacement[0] && displacement[4]<0,'Distinct scroll depth planes');
  await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/hero-scroll-${width}.png`});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(350);
  assert.ok(await page.locator('[data-depth]').evaluateAll(nodes=>nodes.every(n=>Math.abs(new DOMMatrix(getComputedStyle(n).transform).m42)<.01)),'Reversible');
  await page.setViewportSize({width:width+20,height:740});
  await page.evaluate(()=>scrollTo(0,360));
  await page.waitForTimeout(200);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-depth]')).every(n=>Math.abs(new DOMMatrix(getComputedStyle(n).transform).m42)<.01),null,{timeout:5000});
  console.log('Hero',width,'layout, briefing, depth, reverse, resize, reduced motion OK');
  await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
