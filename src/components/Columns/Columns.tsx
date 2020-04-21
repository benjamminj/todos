import { BoxProps, Box } from '../Box'
import { FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
/** @jsx jsx */ jsx

export interface ColumnsProps extends BoxProps {}

export const Columns: FunctionComponent<ColumnsProps> = ({
  children,
  ...props
}) => {
  // TODO: automagical gutters b/w columns?
  // TODO: align prop?
  return (
    <Box {...props} css={{ display: 'flex', flexWrap: 'nowrap' }}>
      {children}
    </Box>
  )
}
