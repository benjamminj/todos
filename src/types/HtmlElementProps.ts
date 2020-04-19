import { DetailedHTMLProps } from 'react'

export type HtmlElementProps<Element> = DetailedHTMLProps<
  React.HTMLAttributes<Element>,
  Element
>
