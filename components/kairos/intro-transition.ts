// A watchdog starts only after an explicit request to enter.
export function startIntroTransition({ play, fade, release }: {
  play: () => { then: (resolve: () => void, reject: () => void) => unknown; stop: () => void };
  fade: () => void;
  release: () => void;
}) {
  let ended = false;
  let fallingBack = false;
  let animation: ReturnType<typeof play> | undefined;
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (ended) return;
    ended = true;
    clearTimeout(watchdog);
    clearTimeout(fallbackTimer);
    release();
  };
  const fallback = () => {
    if (ended || fallingBack) return;
    fallingBack = true;
    clearTimeout(watchdog);
    try { animation?.stop(); } catch { /* Release cannot depend on the animation engine. */ }
    fallbackTimer = setTimeout(finish, 350);
    try { fade(); } catch { finish(); }
  };
  const watchdog = setTimeout(fallback, 1500);
  try {
    animation = play();
    animation.then(() => { if (!fallingBack) finish(); }, fallback);
  } catch { fallback(); }
  return () => {
    ended = true;
    clearTimeout(watchdog);
    clearTimeout(fallbackTimer);
    try { animation?.stop(); } catch { /* Unmount must always clean up. */ }
  };
}
