"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import ConversionEvents from "./ConversionEvents";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { MOTION_DURATION, MOTION_EASE } from "./motion";
import ProblemFlowProvider from "./problem-flow/ProblemFlow";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  if (pathname.startsWith("/admin")) return children;
  // The home owns its focal sequence. A second page-wide transform competes
  // with that entrance and temporarily changes the sticky story's containing block.
  return <LazyMotion features={domAnimation}><ProblemFlowProvider><ConversionEvents /><SiteHeader /><m.div key={pathname} className="page-transition" initial={pathname === "/" || reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : MOTION_DURATION.page, ease: MOTION_EASE }}>{children}</m.div><SiteFooter /></ProblemFlowProvider></LazyMotion>;
}
