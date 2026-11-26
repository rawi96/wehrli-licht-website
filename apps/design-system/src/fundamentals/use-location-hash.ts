'use client';

import { useEffect, useState } from 'react';

/** The URL anchor without «#», decoded; a malformed escape (e.g. «#100%») stays as it is instead of throwing. */
const readHash = (): string => {
  const raw = window.location.hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

/** Next.js updates the URL a moment after a click, once the navigation has rendered. */
const CHECK_AFTER_CLICK_MS = [0, 150, 400];

/**
 * The anchor of the current URL (without «#»), empty on the server and before mount. Next.js links to an anchor on the
 * same page change the URL without a «hashchange» event, so the anchor is also read again shortly after each click.
 */
export const useLocationHash = (): string => {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const timeouts = new Set<number>();
    const update = () => setHash(readHash());
    const updateAfterClick = () => {
      for (const delay of CHECK_AFTER_CLICK_MS) {
        // eslint-disable-next-line @eslint-react/web-api-no-leaked-timeout -- collected in `timeouts`, cleared on cleanup
        const timeout = window.setTimeout(() => {
          timeouts.delete(timeout);
          update();
        }, delay);
        timeouts.add(timeout);
      }
    };
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- the URL hash is only readable in the browser
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    document.addEventListener('click', updateAfterClick);

    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
      document.removeEventListener('click', updateAfterClick);
      for (const timeout of timeouts) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  return hash;
};
