import React, {
  FunctionComponent,
  ReactNode,
  Children,
  DetailedHTMLProps,
} from 'react'
import { GetServerSideProps } from 'next'
import { jsx, InterpolationWithTheme } from '@emotion/core'
/** @jsx jsx */ jsx

//------------------------------------------------------------------------------
// System tokens
//
// Here right now for prototyping, stuff that will be moved into a design / styles
// folder the second it starts getting reused
//------------------------------------------------------------------------------
const spacing = {
  none: 0,
  xxsmall: 4,
  xsmall: 8,
  small: 12,
  medium: 20,
  large: 32,
  xlarge: 48,
  xxlarge: 96,
}
type SpacingToken = keyof typeof spacing

//------------------------------------------------------------------------------
// Layout Components
//
// Here right now for prototyping, will be moved to components folder the second
// if starts getting reused.
//------------------------------------------------------------------------------
type HtmlElementProps<Element> = DetailedHTMLProps<
  React.HTMLAttributes<Element>,
  Element
>

interface BoxProps extends HtmlElementProps<HTMLDivElement> {
  children: ReactNode
  padding?: SpacingToken
  paddingY?: SpacingToken
  paddingX?: SpacingToken
  paddingTop?: SpacingToken
  paddingBottom?: SpacingToken
  paddingLeft?: SpacingToken
  paddingRight?: SpacingToken
}
const Box: FunctionComponent<BoxProps> = ({
  children,
  padding = 'none',
  paddingY,
  paddingX,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  ...props
}) => {
  const getPaddingRules = () => {
    const paddingRules: InterpolationWithTheme<any> = {
      padding: spacing[padding],
    }

    if (paddingY) {
      const value = spacing[paddingY]
      paddingRules.paddingTop = value
      paddingRules.paddingBottom = value
    }

    if (paddingX) {
      const value = spacing[paddingX]
      paddingRules.paddingLeft = value
      paddingRules.paddingRight = value
    }

    if (paddingTop) paddingRules.paddingTop = spacing[paddingTop]
    if (paddingBottom) paddingRules.paddingBottom = spacing[paddingBottom]
    if (paddingLeft) paddingRules.paddingLeft = spacing[paddingLeft]
    if (paddingRight) paddingRules.paddingRight = spacing[paddingRight]

    return paddingRules
  }

  return (
    <div {...props} css={getPaddingRules()}>
      {children}
    </div>
  )
}

interface StackProps {
  children: ReactNode
  space?: SpacingToken
}
const Stack: FunctionComponent<StackProps> = ({ children, space = 'none' }) => {
  return (
    <>
      {Children.map(children, (child, i) => {
        // Don't apply any space before the first child
        if (i === 0) return child

        return <Box paddingTop={space}>{child}</Box>
      })}
    </>
  )
}

interface ColumnProps extends BoxProps {
  children: ReactNode
  width?: 'content' | 'fluid'
}
const Column: FunctionComponent<ColumnProps> = ({
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

interface ColumnsProps extends BoxProps {}
const Columns: FunctionComponent<ColumnsProps> = ({ children, ...props }) => {
  // TODO: automagical gutters b/w columns?
  return (
    <Box {...props} css={{ display: 'flex' }}>
      {children}
    </Box>
  )
}

//------------------------------------------------------------------------------
// Components
//
// Here for fast prototyping, will move out soon.
//------------------------------------------------------------------------------
interface CardProps extends BoxProps {
  children: ReactNode
}
const Card: FunctionComponent<CardProps> = ({ children, ...props }) => {
  return (
    <Box
      {...props}
      padding="medium"
      css={{
        borderRadius: 16,
        border: '1px solid #dcdcdc',
      }}
    >
      {children}
    </Box>
  )
}

// TODO: pull in my text component from @benjamminj/components?
// TODO: font scale?
interface TextProps extends HtmlElementProps<HTMLSpanElement> {}
const Text: FunctionComponent<TextProps> = ({ children, ...props }) => {
  return (
    <span
      {...props}
      css={{
        display: 'block',
      }}
    >
      {children}
    </span>
  )
}

//------------------------------------------------------------------------------
// Page component
//------------------------------------------------------------------------------
interface Props {
  name: string
}

/**
 * Groups of lists
 */
export const ListGroupsPage: FunctionComponent<Props> = ({ name }) => {
  return (
    <>
      <Columns paddingY="large" paddingX="small">
        <Column>Lists</Column>

        <Column width="content">
          <Box paddingX="small">+</Box>
        </Column>

        <Column width="content">
          <Box paddingX="small">o</Box>
        </Column>
      </Columns>

      <Box padding="small" paddingTop="large">
        <Stack space="small">
          {/* TODO: inline or "columns" component */}

          {[
            ['#f0b8ba', 12],
            ['#b8cdf0', 0],
            ['#b8f0d2', 9],
          ].map(([hex, num], i) => (
            <Card key={i} css={{ backgroundColor: hex as string }}>
              <Columns css={{ alignItems: 'center' }}>
                <Column>
                  <Text css={{ fontSize: 24 }}>List #{i + 1}</Text>
                </Column>
                <Column width="content">
                  <Box
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: spacing.xlarge / 2,
                      height: spacing.xlarge,
                      width: spacing.xlarge,
                      background: `rgba(0, 0, 0, 0.1)`,
                    }}
                  >
                    <Text css={{ fontSize: 16 }}>{num}</Text>
                  </Box>
                </Column>
              </Columns>
            </Card>
          ))}
        </Stack>
      </Box>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      name: 'test',
    },
  }
}
