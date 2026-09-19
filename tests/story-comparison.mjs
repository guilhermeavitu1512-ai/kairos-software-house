import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.KAIROS_PLAYWRIGHT||'playwright');
const folder=process.env.KAIROS_CAPTURE_DIR;
if(!folder)throw new Error('Set KAIROS_CAPTURE_DIR to the captured review folder.');
const browser=await chromium.launch({headless:true,executablePath:process.env.KAIROS_BROWSER});
try{
 const page=await browser.newPage({viewport:{width:1440,height:940}});
 const pairs=[['Antes','wipes-1440-0.2.png'],['Agora','rain-1440-calm.png'],['Antes: transição','wipes-1440-0.365.png'],['Agora: aproximação','rain-1440-wipe0-0.7.png']];
 await page.setContent(`<body style="margin:0;background:#071426;color:#f5f7fa;font:18px sans-serif;display:grid;grid-template-columns:1fr 1fr">${pairs.map(([label,file])=>`<div><p style="margin:8px 16px">${label}</p><img style="width:100%;display:block" src="data:image/png;base64,${fs.readFileSync(`${folder}/${file}`).toString('base64')}"></div>`).join('')}</body>`);
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 await page.screenshot({path:`${folder}/story-before-after.png`,fullPage:true});
}finally{await browser.close();}
