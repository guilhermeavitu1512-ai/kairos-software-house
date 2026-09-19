import Image from "next/image";

export default function KairosMark({
  compact = false,
  priority = false,
}: {
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={`kairos-mark${compact ? " kairos-mark--compact" : ""}`} aria-hidden="true">
      <Image
        className="kairos-mark__image"
        src="/brand/kairos-logo.png"
        alt=""
        fill
        sizes={compact ? "34px" : "(max-width: 760px) 180px, 360px"}
        priority={priority}
      />
    </span>
  );
}
