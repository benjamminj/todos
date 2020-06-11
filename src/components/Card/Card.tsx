import React from 'react'
import { BoxProps, Box } from '../Box'
import { ReactNode, FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
/** @jsx jsx */ jsx

export interface CardProps extends BoxProps {
  children: ReactNode
}
export const Card: FunctionComponent<CardProps> = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      padding="medium"
      css={{
        borderRadius: 8,
        border: '1px solid #dcdcdc',
      }}
    >
      {children}
    </Box>
  )
}
