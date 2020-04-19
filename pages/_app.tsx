import * as React from 'react'
import NextApp from 'next/app'
import { CacheProvider, Global } from '@emotion/core'

// Use only { cache } from 'emotion'. Don't use { css }.
import { cache } from 'emotion'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <CacheProvider value={cache}>
        <Global
          styles={{
            body: {
              fontFamily: 'sans-serif',
              fontSize: 20,
              margin: 0,
            },
          }}
        />
        <Component {...pageProps} />
      </CacheProvider>
    )
  }
}
