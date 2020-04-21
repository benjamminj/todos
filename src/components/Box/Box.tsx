import React, { FunctionComponent, ReactNode } from 'react'
import { jsx, InterpolationWithTheme } from '@emotion/core'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { SpacingToken, spacing } from '../../styles/spacing'
/** @jsx jsx */ jsx

export interface BoxProps extends HtmlElementProps<HTMLDivElement> {
  children?: ReactNode
  padding?: SpacingToken
  paddingY?: SpacingToken
  paddingX?: SpacingToken
  paddingTop?: SpacingToken
  paddingBottom?: SpacingToken
  paddingLeft?: SpacingToken
  paddingRight?: SpacingToken
}

export const Box: FunctionComponent<BoxProps> = ({
  children,
  padding = 'none',
  paddingY,
  paddingX,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  ...props
}) => {
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

  return (
    <div {...props} css={getPaddingRules()}>
      {children}
    </div>
  )
}
