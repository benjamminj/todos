import * as React from 'react'
import NextApp from 'next/app'
import { CacheProvider, Global } from '@emotion/core'

// Use only { cache } from 'emotion'. Don't use { css }.
import { cache } from 'emotion'
import { spacing } from '../src/styles/spacing'
import { fontVariants, fontConfig } from '../src/styles/fonts'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <CacheProvider value={cache}>
        <Global
          styles={{
            body: {
              fontFamily: 'sans-serif',
              fontSize:
                fontVariants.body.scale * fontConfig.baseRows * spacing.xxsmall,
              margin: 0,
            },
            a: {
              textDecoration: 'none',
              color: 'inherit',
              fontSize: 'inherit',
            },
          }}
        />
        <Component {...pageProps} />
      </CacheProvider>
    )
  }
}
