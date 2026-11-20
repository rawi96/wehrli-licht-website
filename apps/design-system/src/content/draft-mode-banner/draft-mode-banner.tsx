import { FC } from 'react';

type Props = {
  /** Link that turns draft mode off and returns to the current page. */
  disableHref: string;
  labels?: { text?: string; disable?: string; disableTitle?: string };
};

/** Sticky bar at the top while DatoCMS draft mode shows unpublished content. */
export const DraftModeBanner: FC<Props> = ({ disableHref, labels }) => (
  <div className="bg-wehrli-100 sticky top-0 z-50 flex flex-row items-center justify-center gap-2 p-2 text-sm font-bold">
    <span>{labels?.text ?? 'Draft Mode is enabled'}</span>
    <a
      href={disableHref}
      className="bg-wehrli-200 hover:bg-wehrli-300 rounded-lg px-2 transition-colors"
      title={labels?.disableTitle ?? 'Disable Draft Mode'}
    >
      {labels?.disable ?? 'Disable'}
    </a>
  </div>
);
