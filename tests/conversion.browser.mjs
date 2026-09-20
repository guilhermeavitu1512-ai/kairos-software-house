import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.KAIROS_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({executablePath:process.env.KAIROS_BROWSER,headless:true});
try {
for(const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});
 await page.addStyleTag({content:'nextjs-portal { display:none !important; }'});
 await page.locator('h1').waitFor();
 if(width===1440) await page.screenshot({path:'public/portfolio/kairos-current.png'});
 assert.equal(await page.locator('[data-entry-intro]').count(),0);
 for(const [plan,price,pages,deadline] of [['essencial','397','1 página','5 a 7'],['profissional','597','5 páginas','7 a 10'],['business','697','8 páginas','10 a 15']]) {
  const card=page.locator(`[data-plan="${plan}"]`);const text=await card.innerText();
  for(const expected of [price,pages,deadline]) assert.ok(text.includes(expected),expected);
  assert.match(await card.locator('a').getAttribute('href'),/^https:\/\/wa.me\//);
 }
 await page.locator('#precos').scrollIntoViewIfNeeded();await page.screenshot({path:`outputs/copy-plans-${width}.png`});
 await page.locator('summary').filter({hasText:'O valor é mensal?'}).click();
 assert.ok(await page.locator('details[open]').innerText().then(t=>t.includes('Não.')));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.goto('http://127.0.0.1:3100/contato');
 await page.getByRole('link',{name:'Prefiro preparar um resumo'}).click();
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
 await dialog.getByRole('button',{name:'Editar o que preciso',exact:true}).click();
 await dialog.locator('textarea').fill('Quero um site com cinco páginas.');
 await dialog.getByRole('button',{name:'Revisar alteração',exact:false}).click();
 assert.ok((await dialog.innerText()).includes('cinco páginas'));
 await page.screenshot({path:`outputs/copy-form-${width}.png`});
 await dialog.getByRole('button',{name:'Fechar'}).click();
 for(const route of ['sobre','projetos','privacidade']) {
  const response=await page.goto(`http://127.0.0.1:3100/${route}`);assert.equal(response.status(),200);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
 }
 assert.deepEqual(errors,[]);
 console.log(`Conversion journey ${width}px OK`);await page.close();
}
} finally { await browser.close(); }
