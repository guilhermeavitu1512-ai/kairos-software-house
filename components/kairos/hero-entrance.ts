import { gsap } from "gsap";

/** Only these wrappers belong to the entrance. Scroll/cursor transforms are independent. */
export function createHeroEntrance(stage: HTMLElement, reduced: boolean, mobile: boolean) {
  const words = Array.from(stage.querySelectorAll<HTMLElement>("[data-hero-word]"));
  const targets = Array.from(stage.querySelectorAll<HTMLElement>("[data-hero-word], [data-hero-label], [data-hero-support], [data-hero-actions], [data-hero-enter]"));
  const finish = () => {
    gsap.set(targets, { clearProps: "opacity,visibility,transform,clipPath" });
    stage.dataset.heroEntrance = "complete";
  };
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out", lazy: false }, onComplete: finish });
  stage.dataset.heroEntrance = "prepared";
  if (reduced) {
    timeline.fromTo(targets, { opacity: .6 }, { opacity: 1, duration: .22 }, 0);
    return timeline;
  }

  // Batch geometry reads once, before any animated writes. Natural wrapping stays intact.
  const boxes = words.map(word => word.getBoundingClientRect());
  const rows: number[] = [];
  const rowIndices = boxes.map(box => {
    let index = rows.findIndex(top => Math.abs(top - box.top) < 3);
    if (index === -1) { index = rows.length; rows.push(box.top); }
    return index;
  });
  const duration = mobile ? .9 : 1;
  timeline.addLabel("structure", 0).addLabel("title", .18).addLabel("support", .45).addLabel("action", .55);
  stage.querySelectorAll<HTMLElement>("[data-hero-enter]").forEach(element => {
    const side = element.dataset.heroEnter;
    timeline.fromTo(element, { opacity: .25, x: side === "left" ? -18 : side === "right" ? 18 : 0, y: side === "surface" ? 18 : 0 },
      { opacity: 1, x: 0, y: 0, duration: duration - .03 }, "structure");
  });
  timeline.fromTo("[data-hero-label]", { opacity: 0, y: 3, scaleX: 1.025 }, { opacity: 1, y: 0, scaleX: 1, duration: .42 }, .07);
  words.forEach((word, i) => {
    const siblings = rowIndices.map((row, index) => row === rowIndices[i] ? index : -1).filter(index => index >= 0);
    const spread = (siblings.indexOf(i) - (siblings.length - 1) / 2) * (mobile ? .5 : 1);
    timeline.fromTo(word, {
      opacity: 0, y: mobile ? 9 : 15, x: spread + (word.hasAttribute("data-hero-accent") ? 2 : 0), clipPath: "inset(100% -5% -12% -5%)",
    }, {
      opacity: 1, y: 0, x: 0, clipPath: "inset(-12% -5% -12% -5%)", duration: mobile ? .48 : .56,
      clearProps: "opacity,transform,clipPath",
    }, .18 + rowIndices[i] * Math.min(.07, .22 / Math.max(1, rows.length - 1)));
  });
  timeline.fromTo("[data-hero-support]", { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .4 }, "support");
  timeline.fromTo("[data-hero-actions]", { opacity: 0, y: 7, scale: .98 }, { opacity: 1, y: 0, scale: 1, duration: duration - .55 }, "action");
  return timeline;
}
