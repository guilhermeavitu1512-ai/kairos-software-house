import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.KAIROS_PLAYWRIGHT || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.KAIROS_BROWSER ? { executablePath: process.env.KAIROS_BROWSER } : {}) });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  await page.goto("http://localhost:3000/");
  const section = page.locator("#precos");
  assert.equal(await section.locator("article").count(), 3);
  for (const [index, price] of ["39,70", "59,70", "69,70"].entries()) {
    const plan = section.locator("article").nth(index);
    assert.equal(await plan.locator("li").count(), 4);
    assert.equal(await plan.locator("strong").textContent(), "R$ " + price);
    const url = new URL(await plan.locator("a").getAttribute("href"));
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.pathname, "/5581993858571");
    assert.ok(url.searchParams.get("text").includes(await plan.locator("h3").textContent()));
    assert.ok(url.searchParams.get("text").includes(price));
  }
  assert.ok(!/sem juros|mais vendido|mais escolhido/i.test(await section.textContent()));
  for (const width of [1440, 1024, 768, 320, 360, 375, 390, 430]) {
    await page.setViewportSize({width,height:900});
    const result = await section.evaluate(el => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      plans: [...el.querySelectorAll("article")].map(plan => {
        const strong = plan.querySelector("strong");
        const upfront = strong.nextElementSibling;
        const amount = strong.getBoundingClientRect();
        return { top:plan.getBoundingClientRect().top, left:plan.getBoundingClientRect().left,
          ordered:amount.bottom <= upfront.getBoundingClientRect().top,
          prominent:parseFloat(getComputedStyle(strong).fontSize) > parseFloat(getComputedStyle(upfront).fontSize) * 2 };
      }),
    }));
    assert.equal(result.overflow, false, "Horizontal overflow at " + width);
    assert.ok(result.plans.every(plan => plan.ordered && plan.prominent));
    if(width <=760) assert.ok(result.plans[0].top < result.plans[1].top && result.plans[1].top < result.plans[2].top);
    else assert.ok(result.plans.every(plan => Math.abs(plan.top-result.plans[0].top)<1));
    console.log(width + "px: pricing hierarchy and layout OK");
  }
  const custom = section.getByRole("link", {name:/contar meu problema/});
  assert.equal(await custom.count(), 5);
  for(let index=0; index<5; index++) {
    await custom.nth(index).click();
    assert.ok(await page.locator("dialog").evaluate(el => el.open));
    await page.getByRole("button", {name:"Fechar"}).click();
    assert.equal(await page.evaluate(()=>document.body.style.overflow), "");
  }
  assert.deepEqual(errors,[]);
  console.log("Plan destinations, five briefing links and runtime: OK");
} finally { await browser.close(); }
