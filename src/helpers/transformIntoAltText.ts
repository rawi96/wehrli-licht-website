export const transformIntoAltText = (imageName: string) =>
  imageName.split('.')[0].replace(/[-_]/g, ' ')
