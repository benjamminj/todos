import { jsx } from '@emotion/core'
import { BoxProps, Box } from '../Box'
import { ReactNode, FunctionComponent } from 'react'
import { Text } from '../Text'
/** @jsx jsx */ jsx

export interface ButtonProps extends BoxProps {
  children: ReactNode
  type?: 'submit' | 'button' | 'reset'
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = 'button',
  ...props
}) => {
  return (
    <Box
      as="button"
      type={type}
      padding="medium"
      css={{
        background: '#ddd',
        border: '2px solid #ddd',
        borderRadius: 8,
        width: '100%',
        color: '#555',

        ':hover': {
          cursor: 'pointer',
        },

        ':focus': {
          outline: 'none',
          borderColor: '#555',
        },

        // Remove focus ring from button text since we do have focus styles
        '::-moz-focus-inner': {
          border: 0,
        },
      }}
      {...props}
    >
      <Text variant="button">{children}</Text>
    </Box>
  )
}
