import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({executablePath:process.env.KAIROS_BROWSER,headless:true});
try {
const base=process.env.KAIROS_TEST_URL || "http://127.0.0.1:3101";
for(const width of [1440,820,390]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.audit={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.audit.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.audit.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 await page.goto(base+'/',{waitUntil:'networkidle'});
 assert.match(await page.locator('h1').innerText(),/Da presença digital aos processos que movem seu negócio/);
 console.log('Local production initial metrics',width,await page.evaluate(()=>window.audit));
 assert.ok(await page.evaluate(()=>window.audit.cls<.1),'Initial CLS under .1');
 await page.addStyleTag({content:'nextjs-portal { display:none !important; }'});
 await page.locator('h1').waitFor();
 await page.screenshot({path:`outputs/polish-hero-${width}.png`});
 assert.equal(await page.locator('[data-entry-intro]').count(),0);
 for(const [plan,price,pages,deadline] of [['essencial','397','1 página','5 a 7'],['profissional','597','5 páginas','7 a 10'],['business','697','8 páginas','10 a 15']]) {
  const card=page.locator(`[data-plan="${plan}"]`);const text=await card.innerText();
  for(const expected of [price,pages,deadline]) assert.ok(text.includes(expected),expected);
  assert.equal(await card.locator('a').getAttribute('href'),' /#briefing'.trim());
 }
 await page.locator('#precos').scrollIntoViewIfNeeded();await page.screenshot({path:`outputs/copy-plans-${width}.png`});
 await page.locator('summary').filter({hasText:'O valor é mensal?'}).click();
 assert.ok(await page.locator('details[open]').innerText().then(t=>t.includes('Não.')));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('[data-plan="business"] a').focus();
 await page.keyboard.press('Enter');
 const dialog=page.locator('dialog');await dialog.waitFor({state:'visible'});
 await dialog.getByRole('button',{name:'Continuar',exact:false}).click();
 assert.ok((await dialog.locator('[role="alert"]').innerText()).length);
 await dialog.locator('textarea').fill('Quero um site para minha oficina.');
 await dialog.getByRole('button',{name:'Continuar',exact:false}).click();
 await dialog.getByRole('radio',{name:'Serviço',exact:true}).check();
 await dialog.getByRole('button',{name:'Continuar',exact:false}).click();
 await dialog.locator('input[name="name"]').fill('Teste de navegação');
 await dialog.getByRole('button',{name:'Revisar resumo',exact:false}).click();
 assert.equal(await dialog.locator('dl > div').count(),3);
 const url=await dialog.getByRole('link',{name:'Continuar no WhatsApp'}).getAttribute('href');
 assert.ok(decodeURIComponent(url).includes('Quero um site para minha oficina.'));
 assert.ok(!decodeURIComponent(url).includes('Como funciona hoje:'));
 assert.ok(decodeURIComponent(url).includes('Site Business — R$ 697'));
 await dialog.getByRole('button',{name:'Editar o que preciso',exact:true}).click();
 await dialog.locator('textarea').fill('Quero um site com cinco páginas.');
 await dialog.getByRole('button',{name:'Revisar alteração',exact:false}).click();
 assert.ok((await dialog.innerText()).includes('cinco páginas'));
 await page.screenshot({path:`outputs/copy-form-${width}.png`});
 await dialog.getByRole('button',{name:'Fechar'}).click();
 await page.locator('dialog button').first().waitFor({state:'hidden'});
 assert.equal(await page.locator('[data-plan="business"] a').evaluate(el=>el===document.activeElement),true,'Focus returns to plan');
 for(const route of ['sobre','projetos','privacidade','contato','projetos/vyne','projetos/kairos']) {
  const response=await page.goto(`${base}/${route}`);assert.equal(response.status(),200);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
 }
 assert.deepEqual(errors,[]);
 console.log(`Conversion journey ${width}px OK`);await page.close();
}
} finally { await browser.close(); }
