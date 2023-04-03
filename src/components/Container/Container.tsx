import { ContainerProps } from './types'

export const Container = ({ children }: ContainerProps) => {
  return <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
}
