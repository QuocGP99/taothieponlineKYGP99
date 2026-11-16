/**
 * Safe client-side confetti helper for Next.js App Router.
 * Prevents SSR server-side evaluation of canvas-confetti which causes
 * "Cannot find module './vendor-chunks/canvas-confetti.js'" errors.
 */

export const triggerConfetti = async (options?: any) => {
  if (typeof window === 'undefined') return;
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default || confettiModule;
    if (typeof confetti === 'function') {
      confetti(options);
    }
  } catch (err) {
    console.warn('[Confetti Warning]: Could not trigger confetti effect:', err);
  }
};

export default triggerConfetti;
