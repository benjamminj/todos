import { ReactNode, FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
/** @jsx jsx */ jsx

interface VisuallyHiddenProps {
  children: ReactNode
}

export const VisuallyHidden: FunctionComponent<VisuallyHiddenProps> = ({
  children,
}) => {
  return (
    <span
      css={{
        position: 'absolute',
        height: '1px',
        width: '1px',
        overflow: 'hidden',
        clip: 'rect(1px, 1px, 1px, 1px)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
