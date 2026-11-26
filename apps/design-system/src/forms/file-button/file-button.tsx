import { PhotoIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = {
  label: string;
  /** e.g. `image/*`. */
  accept?: string;
  onFile: (file: File) => void;
  /** Shown filled, e.g. while the chosen file is in use. */
  active?: boolean;
};

/** A chip that opens the file picker. Choosing the same file again works too. */
export const FileButton: FC<Props> = ({ label, accept, onFile, active = false }) => (
  <label
    className={cn(
      'flex cursor-pointer items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors focus-within:outline-2 focus-within:outline-offset-2',
      active ? 'border-wehrli bg-wehrli text-white' : 'hover:border-wehrli border-gray-200 bg-white text-black',
    )}
  >
    <PhotoIcon className="size-4" aria-hidden="true" />
    {label}
    <input
      type="file"
      accept={accept}
      className="sr-only"
      onChange={(event) => {
        const file = event.target.files?.[0];
        // Reset, so the same file fires again.
        event.target.value = '';
        if (file) {
          onFile(file);
        }
      }}
    />
  </label>
);
