import { BoxProps, Box } from '../Box'
import { FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
/** @jsx jsx */ jsx

export interface ColumnsProps extends BoxProps {
  alignY?: 'center' | 'top' | 'bottom' | 'none'
}

const alignments: { [k in Required<ColumnsProps>['alignY']]: string } = {
  center: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
  none: 'normal',
}

export const Columns: FunctionComponent<ColumnsProps> = ({
  children,
  alignY = 'none',
  ...props
}) => {
  // TODO: automagical gutters b/w columns?
  return (
    <Box
      {...props}
      css={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: alignments[alignY],
      }}
    >
      {children}
    </Box>
  )
}
