"use client";
import { useEffect } from "react";
import { trackConversion } from "@/lib/conversion";
export default function ConversionEvents() {
  useEffect(() => {
    function click(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-conversion]") : null;
      if (!target) return;
      const name = target.dataset.conversion;
      if (name === "view_plans" || name === "plan_contact" || name === "whatsapp_open") trackConversion(name, { source: target.dataset.source, plan: target.dataset.planId });
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
