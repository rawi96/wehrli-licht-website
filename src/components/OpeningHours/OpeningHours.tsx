import { global } from '../../data/global'
import { OpeningHoursProps } from './types'

export const OpeningHours = ({ size = 's' }: OpeningHoursProps) => {
  return (
    <span
      className={`${size === 's' && 'text-sm leading-6'} text-center leading-5`}
    >
      {global.openingHours.map((openingHourLine, index) => (
        <p key={index}>{openingHourLine}</p>
      ))}
    </span>
  )
}
