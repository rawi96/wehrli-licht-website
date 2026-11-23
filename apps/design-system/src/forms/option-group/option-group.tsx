import { CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  /** Short explanation below the controls. */
  hint?: ReactNode;
  /** `ok`: the choice fits (check mark), `tip`: a suggestion (light bulb). */
  hintTone?: 'ok' | 'tip';
  /** Keeps the title for screen readers only, e.g. when a heading above already says it. */
  hideTitle?: boolean;
};

const HINT_ICONS = { ok: CheckCircleIcon, tip: LightBulbIcon } as const;

/** A titled group of controls, e.g. in a configurator. */
export const OptionGroup: FC<Props> = ({ title, children, hint, hintTone, hideTitle = false }) => {
  const Icon = hintTone ? HINT_ICONS[hintTone] : null;

  return (
    <fieldset className="flex min-w-0 flex-col gap-3">
      <legend className={hideTitle ? 'sr-only' : 'mb-3 text-base font-bold text-black'}>{title}</legend>
      {children}
      {hint ? (
        <p className="flex items-start gap-2 text-sm text-gray-600">
          {Icon && (
            <Icon
              className={hintTone === 'ok' ? 'text-success size-5 shrink-0' : 'text-wehrli size-5 shrink-0'}
              aria-hidden="true"
            />
          )}
          <span>{hint}</span>
        </p>
      ) : null}
    </fieldset>
  );
};
