import { BoxProps, Box } from '../Box'
import { ReactNode, FunctionComponent } from 'react'

export interface ColumnProps extends BoxProps {
  children: ReactNode
  width?: 'content' | 'fluid'
}

export const Column: FunctionComponent<ColumnProps> = ({
  children,
  width = 'fluid',
  ...props
}) => {
  const widths = {
    content: {
      width: 'auto',
      flexShrink: 1,
    },
    fluid: {
      width: 'auto',
      flexGrow: 1,
      flexShrink: 0,
    },
  }

  return (
    <Box {...props} css={widths[width]}>
      {children}
    </Box>
  )
}
