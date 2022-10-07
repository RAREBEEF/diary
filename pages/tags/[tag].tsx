import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Footer from "../../components/Footer";
import HeaderNav from "../../components/HeaderNav";
import { getTagsThunk } from "../../redux/modules/setDiaries";
import { reduxStateType } from "../../redux/store";

const Tag = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    loginData: {
      userData: { uid },
    },
    diariesData: { tags },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const [dates, setDates] = useState<Array<string>>([]);
  const [monthly, setMonthly] = useState<Array<string>>([]);
  const [tag, setTag] = useState<string>("");

  useEffect(() => {
    if (router.query.dispatched === "true") return;
    dispatch<any>(getTagsThunk(uid));
  }, [dispatch, uid, router]);

  useEffect(() => {
    if (typeof router.query.tag === "string") setTag(router.query.tag);
  }, [router]);

  useEffect(() => {
    const datesArr: Array<string> = tags[tag];
    if (tag !== "" && datesArr) setDates(datesArr.sort().reverse());
  }, [tag, tags]);

  useEffect(() => {
    if (!dates) return;

    const tempArr: Array<string> = [];

    dates.forEach((date: string) => {
      tempArr.push(date.slice(0, 6));
    });

    const sortedUniqueArr = Array.from(new Set(tempArr)).sort().reverse();

    setMonthly(sortedUniqueArr);
  }, [dates]);

  return (
    <section className="page-container">
      <div>
        <HeaderNav title={`#` + tag} subTitle="태그 된 일기" />

        <ol>
          {monthly ? (
            monthly.map((month, i) => (
              <li key={i}>
                <h3>{`${month.slice(0, 4)}년 ${month.slice(4, 6)}월`}</h3>
                <ul>
                  {dates.map((date, i) => {
                    if (date.slice(0, 6) === month)
                      return (
                        <li key={i} className="hover-bigger">
                          <Link href={`/diary/${date}`}>
                            <a>{`${date.slice(
                              4,
                              6
                            )}월 ${date.slice(6)}일`}</a>
                          </Link>
                        </li>
                      );
                  })}
                </ul>
              </li>
            ))
          ) : (
            <p>비어있음</p>
          )}
        </ol>
      </div>
      <Footer />
      <style jsx>{`
        @import "../../styles/var.scss";

        .page-container {
          & > div {
            min-height: 100vh;
            justify-content: center;
            width: 100%;
            max-width: 1000px;
            margin: auto;
            padding: {
              left: 50px;
              right: 50px;
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
        }

        @media all and (max-width: 500px) {
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

export default Tag;
