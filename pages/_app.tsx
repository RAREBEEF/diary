import "@nextcss/reset";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import store from "../redux/store";
import Init from "../components/Init";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Init />
      <Layout>
        <Component {...pageProps} />

        <style jsx global>{`
          @import "../styles/var.scss";

          .page-container {
            min-width: $min-width;
            padding-bottom: $nav-height;
            min-height: 100vh;
          }

          @media all and (max-height: 420px) {
            .page-container {
              padding-bottom: 30px;
            }
          }
        `}</style>
      </Layout>
    </Provider>
  );
}

export default MyApp;
