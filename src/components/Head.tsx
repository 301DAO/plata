import Head from "next/head";

export function AppHead() {
  return (
    <Head>
      <title>Plata App</title>
      <meta charSet="utf-8" />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>"
      />
      <meta
        name="viewport"
        content="initial-scale=1, width=device-width, shrink-to-fit=no"
      />
    </Head>
  );
}
