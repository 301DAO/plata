import { Head, NextScript, Html, Main } from 'next/document';

const APP_NAME = 'Plata App';
const APP_DESCRIPTION = `Next Generation Wealth Management - Easily track your wealth through
a single app and achieve your financial goals with powerful analytic tools.`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://plata.verce.app/" />
        <meta property="og:site_name" content={APP_NAME} />
        <meta
          property="og:image"
          itemProp="image primaryImageOfPage"
          content="icons/apple-touch-icon.png"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="keywords" content="Keywords" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="icons/apple-touch-icon.png" sizes="180x180" />
        <link href="icons/16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="icons/32.png" rel="icon" type="image/png" sizes="32x32" />
        <meta name="theme-color" content="#14141b" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
