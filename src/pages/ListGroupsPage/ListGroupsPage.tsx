import React, {
  FunctionComponent,
  ReactNode,
  Children,
  DetailedHTMLProps,
} from 'react'
import { GetServerSideProps } from 'next'
import { jsx, InterpolationWithTheme } from '@emotion/core'
import { ListService } from '../../modules/lists/list.service'
import { List } from '../../modules/lists/types'
import { PlusIcon } from '../../components/PlusIcon'
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

const fontConfig = {
  baseRows: 4,
  // TODO: better way to store values?
  primary:
    '-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif',
  secondary: `"Palatino Linotype", Palatino, Palladio, "URW Palladio L", "Book Antiqua", Baskerville, "Bookman Old Style", "Bitstream Charter", "Nimbus Roman No9 L", Garamond, "Apple Garamond", "ITC Garamond Narrow", "New Century Schoolbook", "Century Schoolbook", "Century Schoolbook L", Georgia, serif`,
}

interface Variant {
  scale: number
  weight: {
    regular: 'bold' | 'lighter' | 'normal'
    bold: 'bold' | 'lighter' | 'normal'
  }
  letterSpacing: number
  font: 'secondary' | 'primary'
  lineHeight: number
  transform: 'none' | 'uppercase' | 'lowercase'
}

type FontVariantToken =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle'
  | 'overline'
  | 'body'
  | 'body2'
  | 'button'
  | 'caption'

const fontVariants: { [key in FontVariantToken]: Variant } = {
  h1: {
    scale: 4,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  h2: {
    scale: 3,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  h3: {
    scale: 2.5,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  h4: {
    scale: 2,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  h5: {
    scale: 1.5,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  h6: {
    scale: 1.25,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: -0.06,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  subtitle: {
    scale: 1.25,
    weight: {
      regular: 'normal',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'primary',
    lineHeight: 1.25,
    transform: 'none',
  },
  overline: {
    scale: 0.75,
    weight: {
      regular: 'normal',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'secondary',
    lineHeight: 1,
    transform: 'none',
  },
  body: {
    scale: 1,
    weight: {
      regular: 'normal',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'primary',
    lineHeight: 1.5,
    transform: 'none',
  },
  body2: {
    scale: 0.75,
    weight: {
      regular: 'normal',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'primary',
    lineHeight: 1.25,
    transform: 'none',
  },
  button: {
    scale: 1,
    weight: {
      regular: 'bold',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'primary',
    lineHeight: 1.5,
    transform: 'uppercase',
  },
  caption: {
    scale: 0.5,
    weight: {
      regular: 'normal',
      bold: 'bold',
    },
    letterSpacing: 0,
    font: 'primary',
    lineHeight: 1.75,
    transform: 'none',
  },
}

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
interface TextProps extends HtmlElementProps<HTMLSpanElement> {
  variant?: FontVariantToken
  bold?: boolean
}
const Text: FunctionComponent<TextProps> = ({
  children,
  variant = 'body',
  bold = false,
  ...props
}) => {
  const { lineHeight, font, scale, weight } = fontVariants[variant]

  return (
    <span
      {...props}
      css={{
        display: 'block',
        fontFamily: fontConfig[font],
        fontWeight: bold ? weight.bold : weight.regular,
        fontSize: scale * fontConfig.baseRows * spacing.xxsmall,
        lineHeight,
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
  lists: List[]
}

/**
 * Groups of lists
 */
export const ListGroupsPage: FunctionComponent<Props> = ({ lists }) => {
  return (
    <Box css={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Columns paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Column>
          <Text variant="h6">Lists</Text>
        </Column>

        <Column width="content">
          <Box
            css={{
              width: spacing.large,
              height: spacing.large,
              borderRadius: spacing.large / 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              backgroundColor: 'white',
            }}
          >
            <button
              css={{
                margin: 0,
                padding: 0,
                height: '100%',
                width: '100%',
                color: '#494949',
              }}
              onClick={() => console.log('🔥')}
            >
              <PlusIcon
                width={spacing.medium * 1.25}
                height={spacing.medium * 1.25}
              />
              {/* Visually hidden text "Add a list" */}
            </button>
          </Box>
        </Column>
      </Columns>

      <Box padding="small">
        <Stack space="small">
          {/* TODO: inline or "columns" component */}

          {lists.map((list) => (
            <Card key={list.id} css={{ backgroundColor: '#fff' }}>
              <Columns css={{ alignItems: 'center' }}>
                <Column>
                  <Text bold variant="subtitle">
                    {list.name}
                  </Text>
                </Column>
                <Column width="content">
                  <Box
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: spacing.large / 2,
                      height: spacing.large,
                      width: spacing.large,
                      background: `rgba(0, 0, 0, 0.1)`,
                    }}
                  >
                    <Text variant="body">{list.itemIds.length}</Text>
                  </Box>
                </Column>
              </Columns>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const lists = ListService.getAllLists()

  return {
    props: {
      name: 'test',
      lists,
    },
  }
}
