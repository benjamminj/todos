import { Box } from '../Box'
import { FunctionComponent } from 'react'
import { HtmlElementProps } from '../../types/HtmlElementProps'
import { jsx } from '@emotion/core'
import { getFontStylesFromVariant } from '../Text'
/** @jsx jsx */ jsx

export interface InputProps extends HtmlElementProps<HTMLInputElement> {
  label: string
  elevation?: 'inset' | 'none' | 'raised'
}

export const Input: FunctionComponent<InputProps> = ({
  label,
  elevation,
  ...props
}) => {
  return (
    <Box css={{ display: 'flex' }}>
      <Box
        as="input"
        padding="medium"
        css={{
          width: '100%',
          borderRadius: 16,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: '#ddd',
          backgroundColor: elevation === 'inset' ? '#eaeaea' : 'transparent',

          ...getFontStylesFromVariant('body'),

          ':focus': {
            outline: 'none',
            borderColor: '#444',
          },
        }}
        aria-label={label}
        {...props}
      />
    </Box>
  )
}
