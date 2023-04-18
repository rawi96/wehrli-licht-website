import { projectItems } from '../data/projectItems'
import { ProjectWithHeaderImage } from '../types/ProjectWithHeaderImage'
import { getHeaderImageByProject } from './getHeaderImageByProject'

export const getAllProjectsWithHeaderImages = (): ProjectWithHeaderImage[] => {
  return projectItems.map((project) => {
    const headerImage = getHeaderImageByProject(project)
    return { ...project, headerImage }
  })
}
