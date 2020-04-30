import { DetailedHTMLProps, HTMLAttributes } from 'react'

export type HtmlElementProps<
  Element,
  Attributes = HTMLAttributes<Element>
> = DetailedHTMLProps<Attributes, Element>
