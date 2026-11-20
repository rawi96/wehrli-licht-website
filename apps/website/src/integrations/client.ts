import type { Analytics } from '@/ports/analytics';
import { googleAnalytics } from './google-analytics/analytics';

// Composition root for the browser (also safe to import on the server): which integration implements which
// browser-side port. To replace a system, implement the port in a new folder and change the line here.

export const analytics: Analytics = googleAnalytics;
