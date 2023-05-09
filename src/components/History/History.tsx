import Image from 'next/image'
import { historyItems } from '../../data/historyItems'

export const History = () => {
  return (
    <div className="mx-auto my-20 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
      {historyItems.map((item) => (
        <div key={item.name}>
          <time
            dateTime={item.dateTime}
            className="flex items-center font-semibold leading-6 text-wehrli"
          >
            <svg
              viewBox="0 0 4 4"
              className="mr-4 h-1 w-1 flex-none"
              aria-hidden="true"
            >
              <circle cx={2} cy={2} r={2} fill="currentColor" />
            </svg>
            {item.date}
            <div
              className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              aria-hidden="true"
            />
          </time>
          <Image
            alt={item.name}
            className="mt-5 flex-none rounded-lg object-cover sm:aspect-[4/5] sm:w-52 lg:aspect-[1/1] lg:w-full "
            src={item.imageUrl}
            width={255}
            height={255}
          />
          <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
            {item.name}
          </h3>
          <p className="mt-1 text-base leading-7 text-gray-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
