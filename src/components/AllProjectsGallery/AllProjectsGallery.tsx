import Image from 'next/image'
import Link from 'next/link'
import { AnalyticsListener } from '../AnalyticsListener'
import { AllProjectsGalleryProps } from './types'

export const AllProjectsGallery = ({
  projectsWithHeaderImages,
}: AllProjectsGalleryProps) => {
  return (
    <div className="mx-auto mb-32 mt-12 grid gap-6 md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
      {projectsWithHeaderImages.map((project) => (
        <article
          key={project.title}
          className="group relative isolate flex flex-col justify-end overflow-hidden rounded-lg bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
        >
          <Image
            src={project.headerImage.src}
            alt={project.title}
            className="absolute inset-0 -z-10 h-full w-full object-cover transition-opacity group-hover:opacity-75"
            width={640}
            height={872}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
          <div className="absolute inset-0 -z-10 rounded-lg ring-1 ring-inset ring-gray-900/10" />
          {project.lines.map((line) => (
            <div
              key={line}
              className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300"
            >
              {line}
            </div>
          ))}

          <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
            <AnalyticsListener buttonName={project.title}>
              <Link href={`/projekte/${project.slug}`}>
                <span className="absolute inset-0" />
                {project.title}
              </Link>
            </AnalyticsListener>
          </h3>
        </article>
      ))}
    </div>
  )
}
