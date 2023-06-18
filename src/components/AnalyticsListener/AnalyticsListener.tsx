import { usePlausible } from 'next-plausible'
import { AnalyticsListenerProps } from './types'

export const AnalyticsListener = ({
  children,
  buttonName,
  className,
}: AnalyticsListenerProps) => {
  const plausible = usePlausible()

  const clickListener = () => {
    plausible('Click', {
      props: {
        buttonName,
      },
    })
  }

  return (
    <span className={className} onClick={clickListener}>
      {children}
    </span>
  )
}
