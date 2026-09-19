import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./Hero.module.css";

export type KairosSymbolState = "hero" | "organize" | "automate" | "recompose";
export type KairosSymbolProps = {
  state?: KairosSymbolState;
  /** Optional official 3D renderer; retain the static mark until the model is supplied. */
  scene?: ReactNode;
};

export default function KairosSymbol({ state = "hero", scene }: KairosSymbolProps) {
  return <div className={styles.symbol} data-symbol-state={state} aria-hidden="true">
    <div className={styles.symbolSurface}>
      {scene ?? <Image src="/brand/kairos-logo.png" alt="" fill priority loading="eager" sizes="(max-width: 760px) 220px, (max-width: 1100px) 300px, 520px" />}
    </div>
  </div>;
}
