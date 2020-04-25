import { ReactNode, FunctionComponent } from 'react'
import { VisuallyHidden } from '../VisuallyHidden'
import { Box, BoxProps } from '../Box'
import { jsx } from '@emotion/core'
import { spacing, SpacingToken } from '../../styles/spacing'
/** @jsx jsx */ jsx

interface FabProps extends BoxProps<'button'> {
  children: ReactNode
  label: string
  size?: Extract<SpacingToken, 'large' | 'xlarge'>
}

export const Fab: FunctionComponent<FabProps> = ({
  children,
  label,
  size = 'large',
  ...props
}) => {
  const iconSizing = {
    large: spacing.medium,
    xlarge: spacing.large,
  }

  return (
    <Box
      as="button"
      css={{
        height: spacing[size],
        width: spacing[size],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        borderRadius: 12,

        ':focus': {
          outline: 'none',
          border: '2px solid #333',
        },

        ':hover': {
          cursor: 'pointer',
        },

        svg: {
          height: iconSizing[size],
          width: iconSizing[size],
        },
      }}
      {...props}
    >
      {children} <VisuallyHidden>{label}</VisuallyHidden>
    </Box>
  )
}
