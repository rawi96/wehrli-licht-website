'use client';

import { Component, ReactNode } from 'react';

type Props = { children: ReactNode; fallback: ReactNode };

/** Keeps the page usable when the 3D view fails (no WebGL, lost GPU context, …): shows the fallback instead. */
export class StageBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[lampshade-configurator] 3D view failed:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Whether the browser can draw the 3D view (three.js needs WebGL 2). */
export const supportsWebGL = (): boolean => {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
};
