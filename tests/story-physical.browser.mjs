import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER,ignoreDefaultArgs:['--hide-scrollbars'],args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const folder=process.env.KAIROS_CAPTURE_DIR;
const hash=b=>createHash('sha256').update(b).digest('hex');
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.KAIROS_URL||'http://localhost:3000/');
  const intro=page.locator('[data-entry-intro]');await intro.waitFor();
  assert.equal(await intro.locator('[data-frame]').evaluate(e=>getComputedStyle(e).borderTopWidth),'1px');
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-intro.png`});
  await intro.getByRole('button').click();await intro.waitFor({state:'detached'});
  for(const ms of [1000,2000,2000]){
   await page.waitForTimeout(ms);
   assert.equal(await page.locator('[data-entry-intro],[data-copy]').count(),0,'No residual intro nodes at rest');
  }
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-hero-rest.png`});
  const section=page.locator('#sobre'),title=section.locator('h2');
  const go=async p=>{await section.evaluate((el,p)=>scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(1400);};
  await go(.15);await page.locator('#sobre [data-scene=webgl]').waitFor();await page.waitForTimeout(500);
  assert.equal(await title.count(),1);assert.equal(await section.locator('canvas').count(),1);
  assert.equal(await page.locator('#sobre [data-scene]').getAttribute('aria-hidden'),'true');
  assert.equal(await section.locator('canvas').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-calm.png`});
  await go(.5);
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-foreground.png`});
  for(const [i,start]of [[0,.25],[1,.57]]){
   for(const t of [.25,.5,.75,.8,.85,.9,.96,1]){
    await go(start+.2*t);
    assert.equal(await title.count(),1);
    if(folder)await page.screenshot({path:`${folder}/physical-${width}-wipe${i}-${t}.png`});
    if(t===.9){
     // The actual rendered solid surface must cover every glyph. Keeping the
     // heading fully opaque vs hiding it must produce identical screenshots.
     const box=await title.boundingBox();
     const clip={x:Math.floor(box.x),y:Math.floor(box.y),width:Math.ceil(box.width),height:Math.ceil(box.height)};
     const opaque=await page.addStyleTag({content:'#sobre [data-live-copy]{opacity:1!important}'});
     const shown=await page.screenshot({clip});
     const override=await page.addStyleTag({content:'#sobre h2{visibility:hidden!important}'});
     const hidden=await page.screenshot({clip});await override.evaluate(e=>e.remove());await opaque.evaluate(e=>e.remove());
     assert.equal(hash(shown),hash(hidden),`Physical glyph coverage: ${width}, wipe ${i}, ${t}`);
    }
   }
   await go(start+.2*.905);assert.equal(await title.getAttribute('data-chapter'),String(i));
   await go(start+.2*.915);assert.equal(await title.getAttribute('data-chapter'),String(i+1));
   await go(start+.2*.905);assert.equal(await title.getAttribute('data-chapter'),String(i));
   await go(start+.2*.5);
  }
  await go(.95);assert.equal(await title.textContent(),'Construa apenas o que faz sentido.');
  await page.waitForTimeout(3000);
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-construa-rest.png`});
  await page.locator('#lab-title').scrollIntoViewIfNeeded();await page.waitForTimeout(3000);
  assert.equal(await page.locator('#lab-title').count(),1);
  if(folder)await page.screenshot({path:`${folder}/physical-${width}-lab-rest.png`});
  assert.deepEqual(errors,[]);console.log('Physical occlusion, one heading, reverse, intro and Lab at rest:',width,'OK');await page.close();
 }
}finally{await browser.close();}
