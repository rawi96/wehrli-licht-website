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

  const primaryClasses = `
    ${white ? 'text-wehrli bg-white hover:bg-gray-300' : 'text-white bg-wehrli hover:bg-wehrli-600'} 
    ${fullWidth && 'w-full'} 
    shadow-sm px-5 text-base font-semibold py-2.5 
    focus:ring-4 focus:outline-none focus:ring-wehrli-300 
    rounded-lg text-center inline-flex items-center justify-center 
    ${isDisabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-gray-400' : ''}
  `;

  const secondaryClasses = `
    ${white ? 'text-white' : ''} 
    ${fullWidth && 'w-full'} 
    hover:underline focus:ring-4 focus:outline-none focus:ring-wehrli-300 
    rounded-lg text-base font-semibold px-5 py-2.5 text-center 
    inline-flex items-center justify-center
    ${isDisabled ? 'cursor-not-allowed text-gray-400 hover:underline' : ''}
  `;

  return (
    <>
      {href ? (
        <Link className={type === 'primary' ? primaryClasses : secondaryClasses} href={href}>
          {text}
          {type === 'secondary' && <ArrowIcon />}
        </Link>
      ) : (
        <button
          type="button"
          className={type === 'primary' ? primaryClasses : secondaryClasses}
          onClick={onClick}
          disabled={isDisabled}
        >
          {loading && <Spinner />}
          {text}
          {type === 'secondary' && <ArrowIcon />}
        </button>
      )}
    </>
  );
};

const ArrowIcon = () => (
  <svg
    className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
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
