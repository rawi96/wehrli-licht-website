export type NavItem = {
  name: string
  href: string
}

export type NavSection = {
  title: string
  items: NavItem[]
}

export type Navigation = (NavItem | NavSection)[]
