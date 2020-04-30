import { jsx } from '@emotion/core'
import { BoxProps, Box } from '../Box'
import { ReactNode, FunctionComponent } from 'react'
import { Text } from '../Text'
/** @jsx jsx */ jsx

export interface ButtonProps extends BoxProps<'button'> {
  children: ReactNode
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Box
      as="button"
      type="button"
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
      }}
      {...props}
    >
      <Text variant="button">{children}</Text>
    </Box>
  )
}
