import * as React from "react";
import { AppProps } from "next/app";
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import { EmotionCache } from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";

import createEmotionCache from "../utility/createEmotionCache";

interface MyDocumentProps extends DocumentInitialProps {
  emotionStyleTags: JSX.Element[];
}

// App bileşeni için emotionCache içeren bir tip tanımlıyoruz
interface AppWithEmotionCache extends AppProps {
  emotionCache?: EmotionCache;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    const view = ctx.renderPage;

    ctx.renderPage = () =>
      view({
        enhanceApp: (App: React.ComponentType<AppWithEmotionCache>) =>
          function EnhanceApp(props: AppWithEmotionCache) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map(style => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>{this.props.emotionStyleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
