import { ArrowDownTrayIcon, ArrowsPointingOutIcon, ShareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

const ICONS = {
  sparkles: SparklesIcon,
  measure: ArrowsPointingOutIcon,
  download: ArrowDownTrayIcon,
  share: ShareIcon,
} as const;

export type IconButtonIcon = keyof typeof ICONS;

type Props = {
  icon: IconButtonIcon;
  /** Accessible name and tooltip. */
  label: string;
  onClick: () => void;
  /** A toggle that is on. */
  pressed?: boolean;
};

/** A round button with only an icon, e.g. tools on top of a 3D view or an image. */
export const IconButton: FC<Props> = ({ icon, label, onClick, pressed }) => {
  const Icon = ICONS[icon];

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'flex size-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors',
        pressed ? 'bg-wehrli text-white' : 'text-wehrli bg-white/85 hover:bg-white',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
};
