import { jsx } from '@emotion/core'
import { BoxProps, Box } from '../Box'
import { ReactNode, FunctionComponent } from 'react'
import { Columns } from '../Columns'
import { Column } from '../Column'
import { Text } from '../Text'
import { spacing } from '../../styles/spacing'
import { CheckIcon } from '../CheckIcon'
import { useId } from '@reach/auto-id'
/** @jsx jsx */ jsx

export interface CheckboxProps extends BoxProps<'input'> {
  label: ReactNode
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label }) => {
  const id = useId()
  const hoverStyles = {
    ':hover': {
      cursor: 'pointer',
    },
  }
  return (
    <Columns alignY="center" css={hoverStyles}>
      <Column
        width="content"
        css={{
          position: 'relative',
          ...hoverStyles,
        }}
      >
        <input
          type="checkbox"
          id={id}
          css={{
            opacity: 0,
            zIndex: 1,
            position: 'absolute',
            width: spacing.large,
            height: spacing.large,
            ...hoverStyles,
          }}
        />
        <Box
          css={{
            width: spacing.large - 2,
            height: spacing.large - 2,
            border: '2px solid #eaeaea',
            borderRadius: 8,
            backgroundColor: '#eaeaea',
            zIndex: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            svg: {
              opacity: 0,
              fill: '#fff',
              height: spacing.medium,
              width: spacing.medium,
            },

            'input:checked + &': {
              backgroundColor: '#000',
              borderColor: '#000',

              svg: {
                opacity: 1,
              },
            },

            'input:focus + &': {
              borderColor: '#444',
            },
          }}
        >
          <CheckIcon />
        </Box>
      </Column>
      <Column paddingLeft="xsmall" css={hoverStyles}>
        <Text as="label" htmlFor={id} css={hoverStyles}>
          {label}
        </Text>
      </Column>
    </Columns>
  )
}
