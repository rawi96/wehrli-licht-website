import clsx from 'clsx'
import { FC } from 'react'

type Props = {
  className: string,
}

export const Container: FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
}
