import Image from 'next/image'

const timeline = [
  {
    name: 'Gründung Wehrli Lampenatelier St.Gallen',
    description:
      'In den späten 40-iger Jahren beginnt die Geschichte von Wehrli Lampenatelier an der Brühlgasse in St. Gallen.',
    date: '1948',
    dateTime: '1948',
    imageUrl: '/images/history/1948.jpg',
  },
  {
    name: 'Wehrli Lampenatelier Goldach',
    description:
      'Die Gründer Emmy und Karl Wehrli verlegen das Lampenatelier und den Elektroinstallationsbetrieb an die Blumenstrasse 66, in Goldach. Nach und nach wurde der Betrieb erweitert.',
    date: '1952',
    dateTime: '1952',
    imageUrl: '/images/history/1952.jpg',
  },
  {
    name: 'Zweite Generation',
    description:
      'Wurde das Unternehmen von Regula Kleinstein-Wehrli in zweiter Generation übernommen. Das Angebot von Wohnraumleuchten und Lampenschirmen nach Mass wurde stets erweitert und mit Dynamik und Geschick den Wandel in Geschmack und Zeitgeist, Licht und Werkstofftechnik, Beratung und Vertrieb erfolgreich gemeistert. Dieser einzigartige Erfahrungsschatz aus Tradition und Know how macht Wehrli Lampenatelier zum kompetenten Handelspartner und Hersteller von Objektleuchten und Lampenschirmen, in eigener Manufaktur (oder: eigenem Atelier) ',
    date: '1988',
    dateTime: '1988',
    imageUrl: '/images/history/1988.jpg',
  },
  {
    name: 'Dritte Generation – Wehrli Licht GmbH',
    description:
      'Die Geschichte von Wehrli Lampenatelier geht ein Kapitel weiter und an die dritte Generation über. Mariella Kleinstein, eidg. dipl. Lichtplanerin, führt das Geschäftsmodell nun fort und bringt die Lichtplanung als neues Element mit ein. Die Gründung von Wehrli Licht GmbH verkörpert einen neuen Abschnitt in der Geschichte des Unternehmens.',
    date: '2020',
    dateTime: '2020',
    imageUrl: '/images/history/2020.jpg',
  },
]

export const History = () => {
  return (
    <div className="mx-auto my-20 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
      {timeline.map((item) => (
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
          <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
            {item.name}
          </p>
          <p className="mt-1 text-base leading-7 text-gray-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
