import "@nextcss/reset";
import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/LayoutAndInit";
import { Provider } from "react-redux";
import store from "../redux/store";
import Seo from "../components/Seo";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        this.navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successfull with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <Seo />
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
