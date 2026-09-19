import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.KAIROS_PLAYWRIGHT || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.KAIROS_BROWSER ? { executablePath: process.env.KAIROS_BROWSER } : {}) });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("http://localhost:3000/");
    await page.locator("#hero-title").waitFor();
    assert.equal(await page.locator('#inicio a').count(), 1);
    assert.equal(await page.locator('#inicio canvas, #sobre svg, #sobre img, #sobre image').count(), 0);
    assert.equal(await page.locator(".page-transition").evaluate(el => getComputedStyle(el).opacity), "1");
    await page.locator("#inicio a").first().focus();
    assert.ok(await page.locator("#inicio a").first().evaluate(el => el === document.activeElement));
    await page.waitForTimeout(750);
    if (process.env.KAIROS_CAPTURE_DIR) await page.screenshot({ path: `${process.env.KAIROS_CAPTURE_DIR}/home-motion-${width}.png` });
    await page.locator('#sobre').evaluate(el => scrollTo(0, el.offsetTop + (el.offsetHeight-innerHeight)*.52));
    await page.waitForTimeout(700);
    assert.equal(await page.locator('#sobre h2').nth(1).evaluate(el => getComputedStyle(el.parentElement).textAlign), 'center');
    if (process.env.KAIROS_CAPTURE_DIR) await page.screenshot({ path: `${process.env.KAIROS_CAPTURE_DIR}/story-centered-${width}.png` });
    await page.locator('#precos').scrollIntoViewIfNeeded();
    await page.locator('#precos article a').first().focus();
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#precos article strong').first().evaluate(el => getComputedStyle(el).color), 'rgb(136, 198, 255)');
    if (process.env.KAIROS_CAPTURE_DIR) await page.screenshot({ path: `${process.env.KAIROS_CAPTURE_DIR}/prices-effects-${width}.png` });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    assert.equal(await page.locator("#hero-title").evaluate(el => getComputedStyle(el).animationName), "none");
    const stationary = await page.locator("#sobre h2").evaluateAll(items => items.every(h => {
      const transform = getComputedStyle(h.parentElement).transform;
      return transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)";
    }));
    assert.ok(stationary, "Reduced motion must remove chapter translation");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.close();
    console.log(`Home motion, keyboard and reduced motion: ${width} OK`);
  }
} finally { await browser.close(); }
