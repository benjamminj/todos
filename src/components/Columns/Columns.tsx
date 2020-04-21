import { BoxProps, Box } from '../Box'
import { FunctionComponent } from 'react'

export interface ColumnsProps extends BoxProps {}

export const Columns: FunctionComponent<ColumnsProps> = ({
  children,
  ...props
}) => {
  // TODO: automagical gutters b/w columns?
  return (
    <Box {...props} css={{ display: 'flex' }}>
      {children}
    </Box>
  )
}
