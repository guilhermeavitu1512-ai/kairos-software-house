"use client";

import { useEffect, useRef, type ReactNode } from "react";

type BriefingStepProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  focusHeading?: boolean;
};

export default function BriefingStep({ eyebrow, title, description, children, focusHeading = false }: BriefingStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusHeading) headingRef.current?.focus();
  }, [focusHeading, title]);

  return (
    <div className="briefing-step">
      <span className="briefing-step__eyebrow">{eyebrow}</span>
      <h3 ref={headingRef} tabIndex={-1}>{title}</h3>
      {description ? <p className="briefing-step__description">{description}</p> : null}
      <div className="briefing-step__content">{children}</div>
    </div>
  );
}
