import { Html, Head, Main, NextScript } from "next/document";
const Document = () => {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/logos/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/logos/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/logos/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/logos/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/logos/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/logos/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/logos/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/logos/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/logos/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/logos/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/logos/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/logos/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/logos/favicon-128.png"
          sizes="128x128"
        />
        <meta name="application-name" content="Dailiary" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta
          name="msapplication-TileImage"
          content="/logos/mstile-144x144.png"
        />
        <meta
          name="msapplication-square70x70logo"
          content="/logos/mstile-70x70.png"
        />
        <meta
          name="msapplication-square150x150logo"
          content="/logos/mstile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="/logos/mstile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/logos/mstile-310x310.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;