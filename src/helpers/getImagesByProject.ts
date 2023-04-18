import fs from 'fs'
import path from 'path'

import { getImageDirectoryByProject } from './getImageDirectoryByProject'
import { transformIntoAltText } from './transformIntoAltText'
import { Project } from '../types/Project'

export const getImagesByProject = (project: Project) => {
  const imagesDirectory = getImageDirectoryByProject(project)
  return fs
    .readdirSync(imagesDirectory)
    .filter((imageName) =>
      fs.statSync(path.join(imagesDirectory, imageName)).isFile()
    )
    .map((imageName) => ({
      src: path.join(project.imagesPath, imageName),
      altText: transformIntoAltText(imageName),
    }))
}
