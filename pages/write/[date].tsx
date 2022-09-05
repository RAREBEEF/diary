import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import useInput from "../../hooks/useInput";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../fb";
import { useSelector } from "react-redux";
import { reduxStateType } from "../../redux/store";
import { useDispatch } from "react-redux";
import { getDiariesThunk, setDiaryThunk } from "../../redux/modules/setDiaries";
import { getHoliThunk } from "../../redux/modules/setHoli";
import Loading from "../../components/Loading";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Write = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const {
    loginData: {
      userData: { uid },
      isLoggedIn,
    },
    diariesData: { data: diaries, loading },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const { value: title, onChange: onTitleChange } = useInput("");
  const { value: weather, onChange: onWeatherChange } = useInput("");
  const { value: mood, onChange: onMoodChange } = useInput("");
  const { value: content, onChange: onContentChange } = useInput("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [redirectToDiary, setRedirectToDiary] = useState<boolean>(false);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);
  const [{ year, month, date }, setDate] = useState<{
    year: string;
    month: string;
    date: string;
  }>({
    year: "",
    month: "",
    date: "",
  });
  const [todayOrTheDay, setTodayOrTheDay] = useState<"오늘" | "그 날">("오늘");
  const queryDate = router.query.date;

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

  // 날짜에 해당하는 일기가 이미 있는지 체크
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

    // diary 객체가 비어있을 경우 데이터 로드 및 공휴일 데이터 불러오기
    if (Object.keys(diaries).length === 0) {
      dispatch<any>(getDiariesThunk(uid, year, month));
      dispatch<any>(getHoliThunk(year));
      return;
    }

    // 해당하는 일기가 없을 경우 계속 작성
    // 이미 일기가 있을 경우 일기로 이동
    if (
      !diaries[year] ||
      !diaries[year][month] ||
      !diaries[year][month][date]
    ) {
      setInit(true);
      return;
    } else {
      setRedirectToDiary(true);
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

  // 일기 업로드
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const diaryData = {
      attachmentUrl: "",
      attachmentId: "",
      title,
      weather,
      mood,
      content,
    };

    dispatch<any>(
      setDiaryThunk(
        diaryData,
        attachment,
        uid,
        year,
        month,
        date,
        setRedirectToDiary
      )
    );
  };

  // 작성할 일기가 오늘 일자인지 체크
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

  // 첨부파일 등록
  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { files } = e.target;

    if (!files || files.length === 0) {
      return;
    }

    setAttachment(files[0]);
  };

  // 첨부파일 삭제
  const onAttachmentDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setAttachment(null);
  };

  // 리디렉션
  // push를 이렇게 따로 분리하지 않을 경우 Abort fetching component for route: "/" 에러가 출력된다.
  useEffect(() => {
    if (redirectToDiary) {
      router.push(`/diary/${queryDate}`);
    } else if (redirectToHome) {
      router.push("/");
    } else if (redirectToLogin) {
      router.push("/login");
    }
  }, [queryDate, redirectToDiary, redirectToHome, redirectToLogin, router]);

  return init ? (
    <section className="page-container">
      <Loading isShow={loading} text="업로드 중" />

      <nav>
        <Link href="/">
          <a>{"< "}홈으로</a>
        </Link>
        <hgroup>
          <h3>{`${year} / ${month} / ${date}`}</h3>
          <h2>{`${todayOrTheDay}`}의 일기</h2>
        </hgroup>
      </nav>

      <form onSubmit={onSubmit}>
        <div className="input-wrapper">
          <input
            className="title"
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder={`${todayOrTheDay}의 제목`}
          />
          <div className="etc-input-wrapper">
            <input
              className="weather"
              type="text"
              value={weather}
              onChange={onWeatherChange}
              placeholder={`${todayOrTheDay}의 날씨`}
              size={10}
            />
            <input
              className="mood"
              type="text"
              value={mood}
              onChange={onMoodChange}
              placeholder={`${todayOrTheDay}의 기분`}
              size={10}
            />
          </div>
          <textarea
            className="content"
            value={content}
            onChange={onContentChange}
            placeholder={`${todayOrTheDay}의 하루`}
          />
          <div>
            <input
              id="attachment-input"
              type="file"
              accept="image/*"
              ref={attachmentInputRef}
              onChange={onAttachmentChange}
            />
            {attachment ? (
              <Button
                style={{ marginTop: "10px", padding: "5px 15px" }}
                onClick={onAttachmentDelete}
              >
                사진 삭제하기
              </Button>
            ) : (
              <label
                id="attachmentLabel"
                htmlFor="attachment-input"
                className="attachment-label"
              >
                사진 첨부하기
              </label>
            )}
          </div>
        </div>

        <Button
          style={{ width: "140px", alignSelf: "flex-end" }}
        >{`${todayOrTheDay}의 일기, 끝`}</Button>
      </form>

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
          form {
            width: 100%;
            max-width: 1000px;
            margin: auto;
          }

          nav {
            padding: {
              top: 50px;
              bottom: 10px;
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

          form {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 30px;
            margin-bottom: 35px;

            .input-wrapper {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 5px;

              .etc-input-wrapper {
                display: flex;
                flex-wrap: wrap;
                row-gap: 5px;
                input {
                  flex-grow: 1;
                  flex-basis: 10px;
                }
              }

              input,
              textarea,
              label {
                padding: 10px;
                font: {
                  size: 16px;
                }

                &.title,
                &.weather,
                &.mood {
                  border-bottom: 1.5px solid $gray-color;
                  margin: 0px 5px;
                  padding-bottom: 3px;
                }

                &.content {
                  padding: 15px;
                  border: 1.5px solid $gray-color;
                  border-radius: 5px;
                  flex-grow: 1;
                  margin-top: 20px;
                }

                &#attachment-input {
                  display: none;
                }

                &.attachment-label {
                  width: fit-content;
                  padding: 5px 15px;
                  margin-top: 10px;
                  border: 1.5px solid $gray-color;
                  border-radius: 5px;
                  cursor: pointer;
                  filter: none;
                  font: {
                    size: 14px;
                  }
                  &:hover {
                    filter: brightness(1.5);
                  }
                }
              }
            }
          }
        }
      `}</style>
    </section>
  ) : (
    <></>
  );
};

export default Write;
