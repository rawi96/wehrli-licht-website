import { MouseEvent } from 'react'

export type ButtonProps = {
  text: string
  href?: string
  onClick?: (event?: MouseEvent<Element>) => void
  type: 'primary' | 'secondary' | 'tertiary' | 'quaternary'
}
