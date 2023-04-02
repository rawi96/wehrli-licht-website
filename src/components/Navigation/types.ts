export type NavItemType = {
  name: string
  href: string
}

export type NavSectionType = {
  title: string
  items: NavItemType[]
}

export type NavigationType = (NavItemType | NavSectionType)[]
