import { PageContainerProps } from './types'

export const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
}
