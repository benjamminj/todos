import { FunctionComponent, ReactNode, useRef } from 'react'
import { BoxProps, Box } from '../Box'
import { getFontStylesFromVariant } from '../Text'
import { jsx } from '@emotion/core'
import { ChevronIcon } from '../ChevronIcon'
import { spacing } from '../../styles/spacing'
/** @jsx jsx */ jsx

export interface SelectProps extends BoxProps {
  label: string
  children: ReactNode
  elevation?: 'inset' | 'none' | 'raised'
}
export const Select: FunctionComponent<SelectProps> = ({
  label,
  children,
  elevation,
  ...props
}) => {
  const selectRef = useRef<HTMLSelectElement>(null)

  return (
    <Box
      css={{
        display: 'flex',
        position: 'relative',
        backgroundColor: elevation === 'inset' ? '#eaeaea' : 'transparent',
        borderRadius: 16,
      }}
    >
      <Box
        as="select"
        ref={selectRef}
        padding="medium"
        css={{
          appearance: 'none',
          width: '100%',
          borderRadius: 16,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: '#ddd',
          backgroundColor: 'transparent',
          zIndex: 1,

          ...getFontStylesFromVariant('body'),

          ':focus': {
            outline: 'none',
            borderColor: '#444',
          },

          // Remove focus ring from button text since we do have focus styles
          ':-moz-focusring': {
            color: 'transparent',
            textShadow: '0 0 0 #000',
          },
        }}
        aria-label={label}
        {...props}
      >
        {children}
      </Box>

      <ChevronIcon
        css={{
          position: 'absolute',
          top: '50%',
          right: spacing.medium,
          transform: 'translateY(-50%)',
          height: spacing.medium,
          width: spacing.medium,
        }}
      />
    </Box>
  )
}
