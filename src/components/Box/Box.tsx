import React, { FunctionComponent, ReactNode, createElement } from 'react'
import { jsx, InterpolationWithTheme } from '@emotion/core'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { SpacingToken, spacing } from '../../styles/spacing'
/** @jsx jsx */ jsx

export interface BoxProps<TagName extends keyof HTMLElementTagNameMap = 'div'>
  extends HtmlElementProps<HTMLElementTagNameMap[TagName]> {
  children?: ReactNode
  padding?: SpacingToken
  paddingY?: SpacingToken
  paddingX?: SpacingToken
  paddingTop?: SpacingToken
  paddingBottom?: SpacingToken
  paddingLeft?: SpacingToken
  paddingRight?: SpacingToken
  as?: TagName
}

export const Box = <TagName extends keyof HTMLElementTagNameMap>({
  children,
  padding = 'none',
  paddingY,
  paddingX,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  as = 'div' as TagName,
  ...props
}: BoxProps<TagName>) => {
  const getPaddingRules = () => {
    const paddingRules: InterpolationWithTheme<unknown> = {
      padding: spacing[padding],
    }

    if (paddingY) {
      const value = spacing[paddingY]
      paddingRules.paddingTop = value
      paddingRules.paddingBottom = value
    }

    if (paddingX) {
      const value = spacing[paddingX]
      paddingRules.paddingLeft = value
      paddingRules.paddingRight = value
    }

    if (paddingTop) paddingRules.paddingTop = spacing[paddingTop]
    if (paddingBottom) paddingRules.paddingBottom = spacing[paddingBottom]
    if (paddingLeft) paddingRules.paddingLeft = spacing[paddingLeft]
    if (paddingRight) paddingRules.paddingRight = spacing[paddingRight]

    return paddingRules
  }

  return jsx(
    as,
    {
      ...props,
      css: getPaddingRules(),
    },
    children
  )
  // <div {...props} css={}>
  //   {children}
  // </div>
}
