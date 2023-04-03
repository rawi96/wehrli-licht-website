import Image from 'next/image'
import { people } from './data'

export const Team = () => {
  return (
    <ul
      role="list"
      className="mx-auto my-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
    >
      {people.map((person) => (
        <li key={person.name} className="flex flex-col gap-6 xl:flex-row">
          <Image
            className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
            src={person.imageUrl}
            width={416}
            height={520}
            alt={person.imageUrl}
          />
          <div className="flex-auto">
            <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
              {person.name}
            </h3>
            <p className="text-base leading-7 text-gray-600">{person.role}</p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              {person.bio}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
