export const fontConfig = {
  baseRows: 4,
  // TODO: better way to store values?
  primary:
    '-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif',
  secondary:
    '-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif',
}

export interface Variant {
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

export type FontVariantToken =
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

export const fontVariants: { [key in FontVariantToken]: Variant } = {
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
