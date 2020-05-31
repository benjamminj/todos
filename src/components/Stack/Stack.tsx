import React, { ReactNode, FunctionComponent, Children } from 'react'
import { SpacingToken } from '../../styles/spacing'
import { Box, BoxProps } from '../Box'

export interface StackProps extends BoxProps {
  children: ReactNode
  space?: SpacingToken
}

export const Stack: FunctionComponent<StackProps> = ({
  children,
  space = 'none',
}) => {
  return (
    <>
      {Children.map(children, (child, i) => {
        // Don't apply any space before the first child
        if (i === 0) return child

        return <Box paddingTop={space}>{child}</Box>
      })}
    </>
  )
}
