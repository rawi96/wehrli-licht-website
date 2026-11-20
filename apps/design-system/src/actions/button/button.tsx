import Link from 'next/link';
import { FC, MouseEvent, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

type Variant = 'primary' | 'primary-white' | 'secondary' | 'secondary-white';

type Props = {
  children: ReactNode;
  /**
   * `primary`: filled brand button, `primary-white` the same on dark surfaces.
   * `secondary`: text button with an arrow, `secondary-white` the same on dark surfaces.
   */
  variant: Variant;
  href?: string;
  newTab?: boolean;
  onClick?: (event?: MouseEvent<Element>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Arrow after the label of secondary buttons. */
  showArrow?: boolean;
};

const isPrimary = (variant: Variant) => variant === 'primary' || variant === 'primary-white';

const buttonClasses = (variant: Variant, fullWidth: boolean | undefined, isDisabled: boolean | undefined) => {
  const base = 'px-5 py-2.5 rounded-lg text-center inline-flex items-center justify-center text-sm font-bold group';

  if (isPrimary(variant)) {
    return cn(
      base,
      variant === 'primary-white' ? 'text-wehrli bg-white hover:bg-gray-300' : 'text-white bg-wehrli hover:bg-wehrli-600',
      fullWidth && 'w-full',
      !isDisabled && 'shadow-sm',
      isDisabled && 'bg-gray-400 cursor-not-allowed',
    );
  }

  return cn(base, variant === 'secondary-white' && 'text-white', fullWidth && 'w-full', isDisabled && 'cursor-not-allowed');
};

export const Button: FC<Props> = ({
  children,
  variant,
  href,
  newTab,
  onClick,
  type = 'button',
  disabled,
  loading,
  fullWidth,
  showArrow = true,
}) => {
  // A loading button is always disabled, so an action (e.g. placing an order) cannot run twice.
  const isDisabled = !!disabled || !!loading;
  const className = buttonClasses(variant, fullWidth, isDisabled);
  const arrow = !isPrimary(variant) && showArrow && <ArrowIcon />;

  return href ? (
    <Link
      className={className}
      href={href}
      onClick={onClick}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {children}
      {arrow}
    </Link>
  ) : (
    <button type={type} className={className} onClick={onClick} disabled={isDisabled}>
      {loading && <Spinner />}
      {children}
      {arrow}
    </button>
  );
};

const ArrowIcon: FC = () => (
  <svg
    className="ms-2 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1 rtl:rotate-180"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 10"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
  </svg>
);

const Spinner: FC = () => (
  <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
