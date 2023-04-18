import fs from 'fs'
import path from 'path'
import { getImageDirectoryByProject } from './getImageDirectoryByProject'
import { transformIntoAltText } from './transformIntoAltText'
import { Project } from '../types/Project'

export const getHeaderImageByProject = (project: Project) => {
  const headerImageDirectory = path.join(
    getImageDirectoryByProject(project),
    'headerImage'
  )
  const headerImageName = fs.readdirSync(headerImageDirectory)[0]
  return {
    src: path.join(project.imagesPath, 'headerImage', headerImageName),
    altText: transformIntoAltText(headerImageName),
  }
}
