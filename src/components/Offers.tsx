import React from 'react'

const posts = [
  {
    title: 'Lichtplanung',
    href: '/angebot/lichtplanung',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',

    imageUrl: '/images/teasers/lichtplanung.jpg',
  },
  {
    title: 'Lichtberatung',
    href: '#',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit facilis asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut inventore optio animi., tempore temporibus quo laudantium.',
    imageUrl: '/images/teasers/lichtberatung.jpg',
  },
  {
    title: 'Lampenschirme',
    href: '#',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.',
    imageUrl: '/images/teasers/lampenschirme.jpg',
  },
  {
    title: 'Wohnraumleuchten',
    href: '#',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.',
    imageUrl: '/images/teasers/wohnraumleuchten.jpg',
  },
  {
    title: 'Sonderanfertigungen',
    href: '#',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.',
    imageUrl: '/images/teasers/sonderanfertigungen.jpg',
  },
  {
    title: 'Showroom',
    href: '#',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.',
    imageUrl: '/images/teasers/showroom.png',
  },
]

export function Offers() {
  return (
    <div className="relative px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.imageUrl}
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <a href={post.href} className="mt-2 block">
                    <p className="text-xl font-semibold text-wehrli">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {post.description}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
