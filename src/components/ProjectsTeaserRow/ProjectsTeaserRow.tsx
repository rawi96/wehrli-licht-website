import Image from 'next/image'
import Link from 'next/link'
import { ProjectsTeaserRowProps } from './types'

export const ProjectsTeaserRow = ({
  projectsWithHeaderImages,
}: ProjectsTeaserRowProps) => {
  return (
    <div className="pb-20 pt-10">
      <div className="flex overflow-x-scroll pb-5">
        <div className="flex flex-nowrap gap-4">
          {projectsWithHeaderImages.map((project) => (
            <Link href={`/projekte/${project.slug}`} key={project.title}>
              <div className="group relative h-64 w-64 overflow-hidden rounded-lg">
                <Image
                  src={project.headerImage.src}
                  alt={project.title}
                  className="absolute h-full w-full object-cover transition-opacity group-hover:opacity-75"
                  width={256}
                  height={256}
                  sizes="(min-width: 1024px) 256px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-y-1 overflow-hidden p-8 text-sm leading-6 text-gray-300">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                    <span className="absolute inset-0" />
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          <Link
            className="group relative h-64 w-64 overflow-hidden rounded-lg border-black bg-wehrli hover:bg-wehrli-600"
            href="/projekte"
          >
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-lg font-semibold leading-6 text-white">
                Du willst noch mehr Lichtprojekte sehen?
              </h3>
              <p className="mt-4 text-white">
                Dann sieh dir unsere Projekte an.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
