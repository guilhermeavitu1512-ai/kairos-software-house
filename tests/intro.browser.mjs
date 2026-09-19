import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900},hasTouch:true});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
  for(const action of ['click','Enter','Space','touch','reduce']) {
    await page.setViewportSize({width:action==='touch'?390:1440,height:900});
    await page.emulateMedia({reducedMotion:action==='reduce'?'reduce':'no-preference'});
    await page.goto(process.env.KAIROS_URL||'http://localhost:3000/');
    const intro=page.locator('[data-entry-intro]');
    await intro.waitFor();
    await page.waitForTimeout(300);
    assert.equal(await intro.locator('canvas').count(),0,'Line-based intro does not require WebGL');
    assert.ok(await intro.locator('[data-orbit]').count());
    assert.equal(await page.locator('#hero-title').count(),1,'Hero exists before entering');
    await page.evaluate(()=>{window.__hero=document.querySelector('#hero-title');});
    assert.ok(await page.locator('#hero-title').evaluate(el=>Boolean(el.closest('[inert]'))));
    const button=intro.getByRole('button');
    assert.match(await button.innerText(),/Explorar projetos/);
    assert.equal(await intro.getByText('Clique para entrar').count(),0);
    assert.ok(await button.evaluate(el=>parseFloat(getComputedStyle(el).borderRadius)>=24));
    const box=await button.boundingBox();
    assert.ok(box.x>=0&&box.x+box.width<=page.viewportSize().width,'Panel fits viewport');
    await page.keyboard.press('Tab');assert.ok(await button.evaluate(el=>el===document.activeElement));
    await page.mouse.wheel(0,500);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>scrollY),0);
    if(action==='click') {
      await page.waitForTimeout(1600);assert.equal(await intro.count(),1,'No automatic entry');
      if(process.env.KAIROS_CAPTURE_DIR)await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/intro-desktop.png`});
      await page.setViewportSize({width:1280,height:800});
    }
    if(action==='touch'&&process.env.KAIROS_CAPTURE_DIR)await page.screenshot({path:`${process.env.KAIROS_CAPTURE_DIR}/intro-mobile.png`});
    if(action==='Enter'||action==='Space')await page.keyboard.press(action);
    else if(action==='touch')await button.tap();
    else await button.click();
    // Software WebGL can stall wall-clock scheduling; app timing is unchanged.
    await intro.waitFor({state:'detached',timeout:15000});
    assert.equal(await page.locator('.galaxy-container canvas').count(),0,'Galaxy is disposed with the intro');
    await page.waitForFunction(()=>document.activeElement?.id==='hero-title');
    assert.ok(await page.evaluate(()=>window.__hero===document.querySelector('#hero-title')),'Hero was not remounted');
    assert.equal(await page.locator('#hero-title').evaluate(el=>el===document.activeElement),true);
    assert.equal(await page.locator('#hero-title').evaluate(el=>Boolean(el.closest('[inert]'))),false);
    assert.equal(new URL(page.url()).pathname,'/');
    await page.mouse.wheel(0,450);await page.waitForTimeout(300);assert.ok(await page.evaluate(()=>scrollY)>0);
    console.log('Intro:',action,'OK');
  }
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const plain=await noJS.newPage();await plain.goto('http://localhost:3000/');
  assert.equal(await plain.locator('[data-entry-intro]').count(),0);
  assert.equal(await plain.locator('#hero-title').count(),1);
  assert.equal(await plain.locator('[inert]').count(),0);
  await noJS.close();assert.deepEqual(errors,[]);
  console.log('No-JS fallback / runtime: OK');
} finally {await browser.close();}
