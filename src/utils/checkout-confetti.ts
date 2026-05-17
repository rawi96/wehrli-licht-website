import confetti from 'canvas-confetti';

const CONFETTI_COLORS = ['#c41e3a', '#1a1a1a', '#f5f5f5'];

const burstFromSides = (particleCount = 2): void => {
  void confetti({
    particleCount,
    angle: 60,
    spread: 55,
    startVelocity: 35,
    origin: { x: 0, y: 0.65 },
    colors: CONFETTI_COLORS,
  });
  void confetti({
    particleCount,
    angle: 120,
    spread: 55,
    startVelocity: 35,
    origin: { x: 1, y: 0.65 },
    colors: CONFETTI_COLORS,
  });
};

const burstFromCenter = (particleCount = 12, startVelocity = 22): void => {
  void confetti({
    particleCount,
    spread: 70,
    startVelocity,
    origin: { x: 0.5, y: 0.5 },
    colors: CONFETTI_COLORS,
  });
};

const burstFromTop = (): void => {
  void confetti({
    particleCount: 40,
    spread: 100,
    startVelocity: 28,
    gravity: 0.9,
    origin: { x: 0.5, y: 0.2 },
    colors: CONFETTI_COLORS,
  });
};

const playOpeningBurst = (): void => {
  burstFromCenter(80, 42);
  burstFromSides(25);
  burstFromTop();

  window.setTimeout(() => {
    burstFromCenter(50, 32);
    burstFromSides(18);
  }, 180);

  window.setTimeout(() => {
    burstFromCenter(35, 26);
    burstFromSides(12);
  }, 380);
};

export const startCheckoutConfetti = (): (() => void) => {
  playOpeningBurst();

  const sideInterval = window.setInterval(burstFromSides, 400);
  const centerInterval = window.setInterval(burstFromCenter, 2200);

  return () => {
    window.clearInterval(sideInterval);
    window.clearInterval(centerInterval);
    confetti.reset();
  };
};
