import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default class RootDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    return await Document.getInitialProps(context);
  }
  render() {
    return (
      <Html className="dark" lang="en">
        <Head>
          {/** TODO: update meta tags */}
          <meta name="Plata" content="" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
