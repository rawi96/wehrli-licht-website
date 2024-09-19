export const SCROLL_ANIMATION_THRESHOLD = 100;
export const TRANSITION = { duration: 0.3, ease: 'easeInOut' };
export const DELAYED_TRANSITION = { duration: 0.3, ease: 'easeInOut', delay: 0.3 };

export const isWindowSizeBigEnough = () => typeof window !== 'undefined' && window.innerWidth >= 1600;
