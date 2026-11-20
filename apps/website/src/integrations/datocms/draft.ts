import 'server-only';
import { draftMode } from 'next/headers';

/** Draft mode is on (DatoCMS preview links): read unpublished content and cache nothing. */
export const isDraftMode = async (): Promise<boolean> => (await draftMode()).isEnabled;
