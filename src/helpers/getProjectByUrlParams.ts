import { ParsedUrlQuery } from 'querystring'
import { projectItems } from '../data/projectItems'

export const getProjectByUrlParams = (params?: ParsedUrlQuery) => {
  const { slug } = params || {}
  return projectItems.find((project) => project.slug === slug)
}
