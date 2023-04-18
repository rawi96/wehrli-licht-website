import path from 'path'
import { Project } from '../types/Project'

export const getImageDirectoryByProject = (project: Project) =>
  path.join(process.cwd(), 'public', project.imagesPath)
