import { classNames } from '@/utils/css';
import Link from 'next/link';
import { MouseEvent } from 'react';

type Props = {
  text: string;
  href?: string;
  onClick?: (event?: MouseEvent<Element>) => void;
  type: 'primary' | 'secondary';
  disabled?: boolean;
  fullWidth?: boolean;
  white?: boolean;
  loading?: boolean;
};

export const Button = ({ text, href, onClick, type, disabled, fullWidth, white, loading }: Props) => {
  const isDisabled = disabled ?? loading;

  const baseClasses = 'px-5 py-2.5 rounded text-center inline-flex items-center justify-center text-sm font-bold group';
  const primaryClasses = classNames(
    baseClasses,
    white ? 'text-wehrli bg-white hover:bg-gray-300' : 'text-white bg-wehrli hover:bg-wehrli-600',
    fullWidth && 'w-full',
    !isDisabled && 'shadow-sm',
    isDisabled && 'bg-gray-400 cursor-not-allowed',
  );

  const secondaryClasses = classNames(
    baseClasses,
    white && 'text-white',
    fullWidth && 'w-full',
    isDisabled && 'cursor-not-allowed',
  );

  const buttonClasses = type === 'primary' ? primaryClasses : secondaryClasses;

  return href ? (
    <Link className={buttonClasses} href={href}>
      {text}
      {type === 'secondary' && <ArrowIcon />}
    </Link>
  ) : (
    <button type="button" className={buttonClasses} onClick={onClick} disabled={isDisabled}>
      {loading && <Spinner />}
      {text}
      {type === 'secondary' && <ArrowIcon />}
    </button>
  );
};

const ArrowIcon = () => (
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

const Spinner = () => (
  <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
);
