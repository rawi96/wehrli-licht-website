import Link from 'next/link'
import { ButtonProps } from './types'

export const Button = ({ text, href, type }: ButtonProps) => {
  return (
    <>
      {type === 'primary' && (
        <Link
          href={href}
          className="rounded-lg bg-wehrli px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-wehrli-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {text}
        </Link>
      )}
      {type === 'secondary' && (
        <Link
          href={href}
          className="rounded-lg bg-white px-3.5 py-1.5 text-base font-semibold leading-7 text-wehrli shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {text}
        </Link>
      )}
      {type === 'tertiary' && (
        <Link
          href={href}
          className=" text-base font-semibold leading-7 text-white hover:underline"
        >
          {text} <span aria-hidden="true">→</span>
        </Link>
      )}
      {type === 'quaternary' && (
        <Link
          href={href}
          className=" text-base font-semibold leading-7 text-black hover:underline"
        >
          {text} <span aria-hidden="true">→</span>
        </Link>
      )}
    </>
  )
}
