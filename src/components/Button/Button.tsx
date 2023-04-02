import { ButtonProps } from './types'

export const Button = ({ text, href, type }: ButtonProps) => {
  return (
    <>
      {type === 'primary' ? (
        <a
          href={href}
          className="rounded-md bg-wehrli px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {text}
        </a>
      ) : (
        <a href={href} className="text-base font-semibold leading-7 text-white">
          {text} <span aria-hidden="true">→</span>
        </a>
      )}
    </>
  )
}
