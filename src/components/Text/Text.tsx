import { FunctionComponent } from 'react'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { FontVariantToken, fontVariants, fontConfig } from '../../styles/fonts'
import { spacing } from '../../styles/spacing'
import { jsx } from '@emotion/core'
/** @jsx jsx */ jsx

export interface TextProps extends HtmlElementProps<HTMLSpanElement> {
  variant?: FontVariantToken
  bold?: boolean
}

export const getFontStylesFromVariant = (
  variant: FontVariantToken,
  { bold = false }: Pick<TextProps, 'bold'> = {}
) => {
  const { lineHeight, font, scale, weight } = fontVariants[variant]
  return {
    fontFamily: fontConfig[font],
    fontWeight: bold ? weight.bold : weight.regular,
    fontSize: scale * fontConfig.baseRows * spacing.xxsmall,
    lineHeight,
  }
}

export const Text: FunctionComponent<TextProps> = ({
  children,
  variant = 'body',
  bold = false,
  ...props
}) => {
  return (
    <span
      {...props}
      css={{
        display: 'block',
        ...getFontStylesFromVariant(variant, { bold }),
      }}
    >
      {children}
    </span>
  )
}
