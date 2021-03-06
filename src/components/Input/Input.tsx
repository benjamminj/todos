import { Box, BoxProps } from '../Box'
import { FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
import { getFontStylesFromVariant } from '../Text'
/** @jsx jsx */ jsx

export interface InputProps
  extends Omit<BoxProps, 'onChange' | 'onBlur'>,
    Pick<JSX.IntrinsicElements['input'], 'onChange' | 'onBlur'> {
  label: string
  elevation?: 'inset' | 'none' | 'raised'
  autoFocus?: boolean
}

export const Input: FunctionComponent<InputProps> = ({
  label,
  elevation,
  as = 'input',
  placeholder,
  ...props
}) => {
  return (
    <Box
      css={{
        display: 'flex',
        backgroundColor: elevation === 'inset' ? '#eaeaea' : 'transparent',
        borderRadius: 16,
      }}
    >
      <Box
        as={as}
        padding="medium"
        css={{
          width: '100%',
          borderRadius: 16,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: '#ddd',
          background: 'transparent',

          ...getFontStylesFromVariant('body'),

          ':focus': {
            outline: 'none',
            borderColor: '#444',
          },
        }}
        aria-label={label}
        placeholder={placeholder || label}
        {...props}
      />
    </Box>
  )
}
