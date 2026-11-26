import Link from 'next/link';
import { FC } from 'react';

const buttonBase = 'min-h-11 rounded-md px-4 py-2 text-sm font-bold transition-colors';

type CookieBannerLabels = {
  /** What is tracked and why. */
  text: string;
  region: string;
  privacy: string;
  decline: string;
  accept: string;
};

const DEFAULT_LABELS: Omit<CookieBannerLabels, 'text'> = {
  region: 'Cookie-Einstellungen',
  privacy: 'Datenschutz',
  decline: 'Ablehnen',
  accept: 'Akzeptieren',
};

type Props = {
  labels: Partial<CookieBannerLabels> & Pick<CookieBannerLabels, 'text'>;
  /** Link to the privacy page; omitted when not set. */
  privacyHref?: string | null;
  /**
   * The visitor reopened the banner (e.g. from the footer). The banner is rendered into the server HTML; when a
   * choice is already stored, `html[data-consent]` hides it before first paint unless it is reopened (styles.css).
   */
  reopened?: boolean;
  onDecline: () => void;
  onAccept: () => void;
};

/** Consent banner at the bottom left: short text, privacy link, decline and accept buttons of equal size. */
export const CookieBanner: FC<Props> = ({ labels: labelOverrides, privacyHref, reopened, onDecline, onAccept }) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };

  return (
    <section
      data-cookie-banner
      data-open={reopened ? '' : undefined}
      aria-label={labels.region}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-md bg-white p-4 shadow-lg ring-1 ring-gray-200 sm:left-6 sm:mx-0"
    >
      <p className="text-sm text-gray-600">
        {labels.text}{' '}
        {privacyHref && (
          <Link href={privacyHref} className="text-wehrli font-bold underline">
            {labels.privacy}
          </Link>
        )}
      </p>
      <div className="mt-3 flex gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onDecline}
          className={`${buttonBase} hover:border-wehrli hover:text-wehrli border border-gray-200 text-black`}
        >
          {labels.decline}
        </button>
        <button type="button" onClick={onAccept} className={`${buttonBase} bg-wehrli hover:bg-wehrli/90 text-white`}>
          {labels.accept}
        </button>
      </div>
    </section>
  );
};
