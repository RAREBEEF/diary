import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer";
import HeaderNav from "../../components/HeaderNav";
import { getTagsThunk } from "../../redux/modules/setDiaries";
import { reduxStateType } from "../../redux/store";
import Hangul from "hangul-js";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

const Tags = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    loginData: {
      userData: { uid },
      isLoggedIn,
    },
    diariesData: { tags, loading },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const [firstLetters, setFirstLetters] = useState<Array<string>>([]);
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    // 로그인 여부 체크
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    dispatch<any>(getTagsThunk(uid));

    setInit(true);
  }, [dispatch, isLoggedIn, router, uid]);

  // 첫글자 초성 분리
  useEffect(() => {
    if (!tags) return;

    const tempArr: Array<string> = [];

    Object.keys(tags).forEach((tag: string) => {
      tempArr.push(Hangul.disassemble(tag)[0].toUpperCase());
    });

    const sortedUniqueArr = Array.from(new Set(tempArr)).sort((a, b) => {
      if (/[a-zA-Z]/i.test(a) && !/[a-zA-Z]/i.test(b)) return 1;
      else if (/[a-zA-Z]/i.test(b) && !/[a-zA-Z]/i.test(a)) return -1;
      else return a > b ? 1 : -1;
    });

    setFirstLetters(sortedUniqueArr);
  }, [tags]);

  return (
    <section className="page-container">
      <Loading isShow={loading || !init} text="로딩 중" />
      <div>
        <HeaderNav title="나의 태그" subTitle="태그 목록" />
        <ol>
          {firstLetters ? (
            firstLetters.map((letter, i) => (
              <li key={i}>
                <h3>
                  <span className="hash">#</span>
                  {letter}
                </h3>
                <ul>
                  {Object.keys(tags)
                    .sort()
                    .map((tag, i) => {
                      if (Hangul.disassemble(tag)[0].toUpperCase() === letter)
                        return (
                          <li key={i} className="hover-bigger">
                            <Link
                              href={{
                                pathname: `/tags/${tag}`,
                                query: {
                                  dispatched: "true",
                                },
                              }}
                              as={`/tags/${tag}`}
                            >
                              <a>
                                <span className="hash">#</span>
                                {tag}
                              </a>
                            </Link>
                          </li>
                        );
                    })}
                </ul>
              </li>
            ))
          ) : (
            <p>{`태그 목록이 비어있습니다.\n일기를 작성하고 태그를 추가해 보세요.`}</p>
          )}
        </ol>
      </div>
      <style jsx>{`
        @import "../../styles/var.scss";

        .page-container {
          width: 100%;
          padding: {
            left: 50px;
            right: 50px;
          }
          & > div {
            min-height: 100vh;
            justify-content: center;
            width: 100%;
            max-width: 1000px;
            margin: auto;
          }

          ol {
            & > li {
              margin-bottom: 50px;
              padding-left: 20px;
              h3 {
                color: $gray-color;
                margin-bottom: 20px;
                font: {
                  size: 23px;
                  weight: 700;
                }
              }

              ul {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                row-gap: 35px;
                padding-left: 20px;
                p {
                  margin-top: 10vh;
                  height: 100%;
                  white-space: pre-line;
                  text-align: center;
                }

                a {
                  border-radius: 5px;
                  box-shadow: 3px 3px 5px $gray-color;
                  color: $gray-color;
                  padding: 10px 15px;
                  font: {
                    weight: 700;
                    size: 16px;
                  }
                }
              }
            }

            .hash {
              color: darkgray;
              margin-right: 2px;
            }
          }
        }

        @media all and (max-width: 500px) {
          .page-container {
            padding: {
              left: 20px;
              right: 20px;
            }
          }
        }
      `}</style>
      <Footer />
    </section>
  );
};

export default Tags;
