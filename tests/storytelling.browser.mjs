import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.KAIROS_PLAYWRIGHT || "playwright");
const browser = await chromium.launch({
  headless: true,
  ...(process.env.KAIROS_BROWSER ? { executablePath: process.env.KAIROS_BROWSER } : {}),
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  for (const width of [1366, 1440, 1920, 320, 390, 430]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    await page.goto("http://localhost:3000/?test=story");
    assert.equal(await page.locator("#inicio img, #inicio image").count(), 0, "Hero must not repeat the full logo");
    assert.equal(await page.locator("#hero-title").textContent(), "Ainda depende de WhatsApp, caderno e planilhas?");
    const section = page.locator("#sobre");
    await section.waitFor();
    for (const phase of [.12, .52, .94]) {
      await section.evaluate((el, p) => window.scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * p), phase);
      await page.waitForTimeout(650);
      const layout = await section.evaluate(el => {
        const copies = [...el.querySelectorAll("h2")].filter(h => Number(getComputedStyle(h.parentElement.parentElement).opacity) > .9);
        const box = copies[0]?.getBoundingClientRect();
        return { count: copies.length, text: copies[0]?.textContent, styles: [...el.querySelectorAll('h2')].map(h=>h.parentElement.parentElement.getAttribute('style')), overflow: document.documentElement.scrollWidth > innerWidth,
          visible: box && box.top >= 70 && box.bottom <= innerHeight };
      });
      assert.equal(layout.count, 1, JSON.stringify({width, phase, layout}));
      assert.equal(layout.overflow, false);
      assert.ok(layout.visible, JSON.stringify({width, phase, layout}));
    }
    const beforeWheel = await page.evaluate(() => scrollY);
    await page.mouse.move(width * .7, 550);
    await page.mouse.wheel(0, 160);
    await page.waitForTimeout(500);
    assert.ok(await page.evaluate(() => scrollY) > beforeWheel, "Vertical wheel must not be intercepted");
    // Allow the short spring tail to settle before checking for continuous loops.
    await page.waitForTimeout(1600);
    const settled = await section.evaluate(el => [...el.querySelectorAll("[style]")].map(n => n.getAttribute("style")).join("|"));
    await page.waitForTimeout(400);
    const stopped = await section.evaluate(el => [...el.querySelectorAll("[style]")].map(n => n.getAttribute("style")).join("|"));
    assert.equal(settled, stopped, "Scroll-driven graphics must stop moving at rest");
    // Fast scroll past the sticky section must not trap page navigation.
    await page.locator("#projetos").scrollIntoViewIfNeeded();
    assert.ok(await page.locator("#lab-title").isVisible());
    console.log("normal scroll:", width, "OK");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({width:390,height:844});
  await page.goto("http://localhost:3000/?test=story-reduced");
  await page.waitForTimeout(500);
  const reduced = await page.locator("#sobre").evaluate(el => ({
    position: getComputedStyle(el.firstElementChild).position,
    chapters: [...el.querySelectorAll("h2")].map(h => ({
      opacity: getComputedStyle(h.parentElement.parentElement).opacity,
      position: getComputedStyle(h.parentElement.parentElement).position,
    })),
  }));
  assert.equal(reduced.position, "relative");
  assert.ok(reduced.chapters.every(c => c.opacity === "1" && c.position === "relative"));
  await page.locator("#sobre").scrollIntoViewIfNeeded();
  if (process.env.KAIROS_SCREENSHOT) await page.screenshot({path:process.env.KAIROS_SCREENSHOT});
  assert.deepEqual(errors, []);
  console.log("reduced motion and runtime errors: OK");
} finally { await browser.close(); }
