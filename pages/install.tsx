import Link from "next/link";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

const Install = () => {
  return (
    <section className="page-container">
      <Seo title="일기장 | 설치"/>
      <div>
        <nav>
          <div className="btn-wrapper">
            <Link href="/">
              <a>{"< "}홈으로</a>
            </Link>
          </div>
          <hgroup>
            <h1>앱 설치하기</h1>
          </hgroup>
        </nav>
        <section className="contents">
          <section>
            Palette Vault는{" "}
            <a
              href="https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%A0%88%EC%8B%9C%EB%B8%8C_%EC%9B%B9_%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98"
              target="_blank"
              rel="noreferrer"
            >
              프로그레시브 웹 애플리케이션
            </a>
            을 목표로 개발 진행 중이며 데스크톱과 모바일 환경에서 설치하여
            사용할 수 있습니다.
            <br />
            <br />
            아래 튜토리얼을 따라 설치를 진행하거나{" "}
            <Link href="/">
              <a>웹으로 계속하기</a>
            </Link>
            를 클릭하여 건너뛸 수 있습니다.
          </section>
          <section className="tutorial">
            <h3>설치 방법</h3>
            <section>
              <h4>안드로이드</h4>
              <ol>
                <li>1. 크롬 브라우저 설치</li>
                <li>2. 크롬으로 접속 후 홈 화면의 설치 버튼 클릭</li>
              </ol>
            </section>
            <section>
              <h4>iOS safari</h4>
              <ol>
                <li>1. 공유 버튼 클릭</li>
                <li>2. 홈 화면에 추가 클릭</li>
              </ol>
            </section>
            <section>
              <h4>설치에 실패할 경우</h4>
              <a
                href="https://support.google.com/chrome/answer/9658361?hl=ko&co=GENIE.Platform%3DAndroid&oco=0"
                target="_blank"
                rel="noreferrer"
              >
                설치 튜토리얼
              </a>{" "}
              참고
            </section>
          </section>
        </section>
      </div>

      <Footer />

      <style jsx>{`
        @import "../styles/var.scss";

        .page-container {
          & > div {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: {
              left: 50px;
              right: 50px;
            }

            nav,
            .contents {
              width: 100%;
              margin: auto;
            }

            nav {
              max-width: 1000px;
              padding: {
                top: 50px;
                bottom: 50px;
              }

              hgroup {
                width: fit-content;
                color: $gray-color;
                margin-top: 20px;

                h1 {
                  width: fit-content;
                  font: {
                    size: 30px;
                    weight: 700;
                  }
                }

                h2 {
                  margin: {
                    left: 2.5px;
                  }
                }
              }
            }

            .contents {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 40px;
              width: 80%;
              max-width: 800px;
              padding-bottom: 50px;
              word-break: keep-all;

              a {
                color: darkblue;
                font-weight: 500;
              }

              .tutorial {
                position: relative;
                text-align: center;
                border: 1px solid $gray-color;
                border-radius: 15px;
                padding: 30px 40px 10px;
                margin-top: 30px;
                display: flex;
                flex-direction: column;

                h3 {
                  position: absolute;
                  width: fit-content;
                  height: 30px;
                  line-height: 30px;
                  background-color: white;
                  padding: 0px 5px;
                  top: -15px;
                  left: 15px;
                  color: $gray-color;
                  font: {
                    size: 16px;
                    weight: 700;
                  }
                }

                & > section {
                  margin: 0px 0px 30px;
                  ol {
                    display: flex;
                    flex-direction: column;
                    row-gap: 10px;
                  }
                  h4 {
                    margin-bottom: 10px;
                    font: {
                      size: 20px;
                      weight: 500;
                    }
                  }
                }
              }
            }
          }
        }

        @media all and (max-width: 380px) {
          .page-container {
            & > div {
              padding: {
                left: 20px;
                right: 20px;
              }
            }
          }
        }
      `}</style>
    </section>
  );
};

export default Install;
