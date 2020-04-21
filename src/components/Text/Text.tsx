import { FunctionComponent } from 'react'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { FontVariantToken, fontVariants, fontConfig } from '../../styles/fonts'
import { spacing } from '../../styles/spacing'

export interface TextProps extends HtmlElementProps<HTMLSpanElement> {
  variant?: FontVariantToken
  bold?: boolean
}

export const Text: FunctionComponent<TextProps> = ({
  children,
  variant = 'body',
  bold = false,
  ...props
}) => {
  const { lineHeight, font, scale, weight } = fontVariants[variant]

  return (
    <span
      {...props}
      css={{
        display: 'block',
        fontFamily: fontConfig[font],
        fontWeight: bold ? weight.bold : weight.regular,
        fontSize: scale * fontConfig.baseRows * spacing.xxsmall,
        lineHeight,
      }}
    >
      {children}
    </span>
  )
}
