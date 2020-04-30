import { FunctionComponent } from 'react'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { FontVariantToken, fontVariants, fontConfig } from '../../styles/fonts'
import { spacing } from '../../styles/spacing'
import { jsx } from '@emotion/core'
import { Box, BoxProps } from '../Box'
/** @jsx jsx */ jsx

export type TextProps<
  TagName extends keyof JSX.IntrinsicElements = 'span'
> = BoxProps<TagName> & {
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

export const Text = <TagName extends keyof JSX.IntrinsicElements>({
  children,
  variant = 'body',
  bold = false,
  as = 'span' as TagName,
  ...props
}: TextProps<TagName>) => {
  return (
    <Box
      {...props}
      as={as}
      css={{
        display: 'block',
        ...getFontStylesFromVariant(variant, { bold }),
      }}
    >
      {children}
    </Box>
  )
}
