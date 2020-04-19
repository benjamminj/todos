import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import { extractCritical } from 'emotion-server'

interface Props extends DocumentInitialProps {
  css: string
  ids: string[]
}

export default class MyDocument extends Document<Props> {
  static async getInitialProps({ renderPage }: DocumentContext) {
    const page = await renderPage()
    const styles = extractCritical(page.html)
    return { ...page, ...styles }
  }

  render() {
    return (
      <html>
        <Head>
          <style
            data-emotion-css={this.props.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
