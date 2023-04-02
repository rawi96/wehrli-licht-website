import { TitleSectionProps } from './types'

export const TitleSection = ({ title, intro }: TitleSectionProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-wehrli sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
        {intro}
      </p>
    </div>
  )
}
