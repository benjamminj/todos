import { ReactNode } from 'react'
import { jsx, InterpolationWithTheme } from '@emotion/core'
import { SpacingToken, spacing } from '../../styles/spacing'
/** @jsx jsx */ jsx

export type BoxProps<TagName extends keyof JSX.IntrinsicElements = 'div'> = {
  children?: ReactNode
  padding?: SpacingToken
  paddingY?: SpacingToken
  paddingX?: SpacingToken
  paddingTop?: SpacingToken
  paddingBottom?: SpacingToken
  paddingLeft?: SpacingToken
  paddingRight?: SpacingToken
  as?: TagName
} & JSX.IntrinsicElements[TagName]

export const Box = <TagName extends keyof JSX.IntrinsicElements>({
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
}
