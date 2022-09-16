import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Seo from "../../components/Seo";
import {
  deleteDiaryThunk,
  getDiariesThunk,
} from "../../redux/modules/setDiaries";
import { getHoliThunk } from "../../redux/modules/setHoli";
import { reduxStateType } from "../../redux/store";
import { DiaryType } from "../../type";

const Diary = () => {
  const {
    loginData: {
      isLoggedIn,
      userData: { uid },
    },
    diariesData: { data: diaries },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryDate = router.query.date;
  const [diary, setDiary] = useState<DiaryType>({
    attachmentUrl: "",
    attachmentId: "",
    date: "",
    title: "",
    weather: "",
    mood: "",
    content: "",
  });
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [redirectToWrite, setRedirectToWrite] = useState<boolean>(false);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);
  const [todayOrTheDay, setTodayOrTheDay] = useState<"오늘" | "그 날">("오늘");
  const [{ year, month, date }, setDate] = useState<{
    year: string;
    month: string;
    date: string;
  }>({
    year: "",
    month: "",
    date: "",
  });

  // 쿼리로 받은 날짜를 상태에 저장
  useEffect(() => {
    //  url(날짜) 체크
    if (
      !queryDate ||
      typeof queryDate !== "string" ||
      !/^[12][09][0-9][0-9][01][0-9][0-3][0-9]$/.test(queryDate)
    ) {
      setRedirectToHome(true);
      return;
    }

    const year = queryDate.slice(0, 4);
    const month = queryDate.slice(4, 6);
    const date = queryDate.slice(-2);

    setDate({ year, month, date });
  }, [queryDate, setDate]);

  // 날짜에 해당하는 일기 확인하고 가져오기
  // 확인이 끝나기 전까지는 빈 페이지를 출력
  useEffect(() => {
    // 로그인 여부 체크
    if (!isLoggedIn) {
      setRedirectToLogin(true);
      return;
    }

    // 날짜 초기화 여부 체크
    if (year.length === 0 || month.length === 0 || date.length === 0) {
      return;
    }

    // 해당 날짜의 일기 데이터가 비어있을 경우 데이터 로드 및 공휴일 데이터 불러오기
    if (
      Object.keys(diaries).indexOf(year) === -1 ||
      Object.keys(diaries[year]).indexOf(month) === -1
    ) {
      dispatch<any>(getDiariesThunk(uid, year, month));
      dispatch<any>(getHoliThunk(year));
      return;
    }

    // 해당하는 일기가 없을 경우 작성으로 이동
    // 일기가 있을 경우 출력
    if (
      !diaries[year] ||
      !diaries[year][month] ||
      !diaries[year][month][date]
    ) {
      setRedirectToWrite(true);
      return;
    } else {
      setInit(true);
      setDiary(diaries[year][month][date]);
    }
  }, [
    date,
    diaries,
    dispatch,
    isLoggedIn,
    month,
    queryDate,
    redirectToHome,
    router,
    uid,
    year,
  ]);

  // 불러온 일기가 오늘 일자인지 체크
  useEffect(() => {
    const today = new Date();

    if (
      today.getFullYear() === parseInt(year) &&
      today.getMonth() + 1 === parseInt(month) &&
      today.getDate() === parseInt(date)
    ) {
      setTodayOrTheDay("오늘");
    } else {
      setTodayOrTheDay("그 날");
    }
  }, [date, month, year]);

  // 삭제
  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const ok = window.confirm(
      `일기를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.`
    );

    if (ok) {
      dispatch<any>(
        deleteDiaryThunk(diary?.attachmentId, uid, year, month, date)
      );
      setRedirectToHome(true);
    }
  };

  // 홈으로 이동
  // push를 이렇게 따로 분리하지 않을 경우 Abort fetching component for route: "/" 에러가 출력된다.
  useEffect(() => {
    if (redirectToHome) {
      router.push("/");
    } else if (redirectToWrite) {
      router.push(`/write/${queryDate}`);
    } else if (redirectToLogin) {
      router.push("/login");
    }
  }, [queryDate, redirectToHome, redirectToLogin, redirectToWrite, router]);

  return init ? (
    <section className="page-container">
      <Seo
        title={`Dailiary | ${todayOrTheDay === "오늘" ? "Today" : queryDate}`}
      />
      <nav>
        <div className="btn-wrapper">
          <Link href="/">
            <a>{"< "}홈으로</a>
          </Link>
          <section className="tool-bar">
            <Button style={{ border: "none", padding: "0" }}>
              <Link href={`/write/${queryDate}`}>
                <a>수정</a>
              </Link>
            </Button>
            <Button
              onClick={onDeleteClick}
              style={{ border: "none", padding: "0" }}
            >
              삭제
            </Button>
          </section>
        </div>
        <hgroup>
          <h3>{`${year} / ${month} / ${date}`}</h3>
          <h2>{diary.title}</h2>
        </hgroup>
      </nav>
      <section className="contents">
        {(diary.weather || diary.mood) && (
          <div className="etc-content-wrapper">
            {diary.weather && (
              <section className="weather">
                <h4>{`${todayOrTheDay}의 날씨`}</h4>
                <p>{diary.weather}</p>
              </section>
            )}
            {diary.mood && (
              <section className="weather">
                <h4>{`${todayOrTheDay}의 기분`}</h4>
                <p>{diary.mood}</p>
              </section>
            )}
          </div>
        )}
        <div className="main-content-wrapper">
          {diary.attachmentUrl && (
            <section className="image">
              <h4> {`${todayOrTheDay}의 사진`}</h4>
              <div className="image-wrapper">
                <Image
                  src={diary.attachmentUrl}
                  alt={"attachment"}
                  width={100}
                  height={80}
                  layout="responsive"
                  objectFit="contain"
                />
              </div>
            </section>
          )}

          {diary.content && (
            <section className="content">
              <h4> {`${todayOrTheDay}의 하루`}</h4>
              <p>{diary.content}</p>
            </section>
          )}
        </div>
      </section>

      <style jsx>{`
        @import "../../styles/var.scss";

        .page-container {
          display: flex;
          flex-direction: column;
          padding: {
            left: 50px;
            right: 50px;
          }

          nav,
          .contents {
            width: 100%;
            max-width: 1000px;
            margin: auto;
          }

          nav {
            padding: {
              top: 50px;
              bottom: 10px;
            }

            .btn-wrapper {
              display: flex;
              .tool-bar {
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
              }
            }

            hgroup {
              width: fit-content;
              color: $gray-color;
              margin-top: 20px;

              h2 {
                width: fit-content;
                font: {
                  size: 30px;
                  weight: 700;
                }
              }

              h3 {
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
            height: 100%;
            gap: 30px;
            margin-bottom: 35px;

            section {
              padding: 10px;
              border-bottom: 0.5px solid $gray-color;
              font: {
                size: 16px;
              }

              h4 {
                color: $gray-color;
                padding: 0px 10px 10px;
                font: {
                  size: 20px;
                  weight: 700;
                }
              }
              p {
                padding: 0px 15px;
              }
            }

            .etc-content-wrapper {
              display: flex;
              flex-wrap: wrap;
              row-gap: 5px;
              white-space: nowrap;
              section {
                flex-grow: 1;
                flex-basis: 10px;
                color: $gray-color;
                font: {
                  size: 16px;
                }
              }
            }

            .main-content-wrapper {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              gap: 5%;

              .image,
              .content {
                padding-bottom: 40px;
              }

              .image {
                width: 50%;
                border: none;
                height: fit-content;
                flex-grow: 1;
                .image-wrapper {
                  margin-top: 5px;
                }
              }

              .content {
                width: 45%;
                white-space: pre-line;
                flex-grow: 1;
                border: none;
              }
            }
          }
        }

        @media all and (max-width: 500px) {
          .page-container {
            .contents {
              .main-content-wrapper {
                flex-direction: column;
                align-items: center;
                gap: 15px;

                .image,
                .content {
                  width: 100%;
                }
              }
            }
          }
        }
      `}</style>
    </section>
  ) : (
    <>
      <Seo />
    </>
  );
};

export default Diary;
