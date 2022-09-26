import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import useInput from "../../hooks/useInput";
import { useSelector } from "react-redux";
import { reduxStateType } from "../../redux/store";
import { useDispatch } from "react-redux";
import { getDiariesThunk, setDiaryThunk } from "../../redux/modules/setDiaries";
import { getHoliThunk } from "../../redux/modules/setHoli";
import Loading from "../../components/Loading";
import Link from "next/link";
import { DiaryType } from "../../type";
import { storage } from "../../fb";
import { deleteObject, ref } from "firebase/storage";
import classNames from "classnames";
import Seo from "../../components/Seo";

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
  const {
    value: title,
    setValue: setTitle,
    onChange: onTitleChange,
  } = useInput("");
  const {
    value: weather,
    setValue: setWeather,
    onChange: onWeatherChange,
  } = useInput("");
  const {
    value: directWeather,
    setValue: setDirectWeather,
    onChange: onDirectWeatherChange,
  } = useInput("");
  const {
    value: mood,
    setValue: setMood,
    onChange: onMoodChange,
  } = useInput("");
  const {
    value: directMood,
    setValue: setDirectMood,
    onChange: onDirectMoodChange,
  } = useInput("");
  const {
    value: content,
    setValue: setContent,
    onChange: onContentChange,
  } = useInput("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [redirectToDiary, setRedirectToDiary] = useState<boolean>(false);
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fileEdited, setFileEdited] = useState<boolean>(false);
  const [prevDiary, setPrevDiary] = useState<DiaryType | null>(null);
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
    // 이미 일기가 있을 경우 수정모드 진입
    if (
      !diaries[year] ||
      !diaries[year][month] ||
      !diaries[year][month][date]
    ) {
      setInit(true);
      return;
    } else {
      const prev: DiaryType = diaries[year][month][date];
      setPrevDiary(prev);
      setEditMode(true);
      setTitle(prev.title);
      setMood(prev.mood);
      setWeather(prev.weather);
      setContent(prev.content);
      setInit(true);
      return;
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
    setContent,
    setMood,
    setTitle,
    setWeather,
    uid,
    year,
  ]);

  // 일기 업로드
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (title.length === 0) {
      window.alert("제목을 입력해 주세요.");
      return;
    } else if (!attachment && !content) {
      window.alert("본문과 사진 중 최소 하나 이상의 내용이 필요합니다.");
      return;
    }

    let diaryData = {
      attachmentUrl: "",
      attachmentId: "",
      date:
        typeof queryDate === "string" ? queryDate : `${year}${month}${date}`,
      title,
      weather: weather === "direct" ? directWeather : weather,
      mood: mood === "direct" ? directMood : mood,
      content,
    };

    // 수정모드일 경우 기존 첨부사진 데이터 이어받음
    if (editMode && prevDiary) {
      diaryData.attachmentId = prevDiary.attachmentId;
      diaryData.attachmentUrl = prevDiary.attachmentUrl;

      // 첨부사진이 수정 되었을 경우 기존의 사진을 스토리지에서 삭제
      if (fileEdited) {
        const storageRef = ref(storage, `${uid}/${diaryData.attachmentId}`);
        await deleteObject(storageRef);
      }
    }

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

    if (editMode) {
      setFileEdited(true);
    }

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
      <Seo
        title={`일기장 | ${todayOrTheDay === "오늘" ? "오늘" : queryDate}`}
      />
      <Loading isShow={loading} text="업로드 중" />

      <nav>
        <Link href={editMode ? `/diary/${queryDate}` : "/"}>
          <a>
            {"< "}
            {editMode ? "돌아가기" : "홈으로"}
          </a>
        </Link>
        <hgroup>
          <h2>{`${year} / ${month} / ${date}`}</h2>
          <h1>{`${todayOrTheDay}`}의 일기</h1>
        </hgroup>
      </nav>

      <form onSubmit={onSubmit}>
        <div className="input-wrapper">
          <input
            className="title"
            list="title-list"
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder={`${todayOrTheDay}의 제목`}
            maxLength={60}
          />
          <datalist id="title-list">
            <option
              value={`${year} / ${month} / ${date}`}
            >{`${year} / ${month} / ${date}`}</option>
          </datalist>
          <div className="etc-input-wrapper">
            {/* <input
              className="weather"
              list="weather-list"
              type="text"
              value={weather}
              onChange={onWeatherChange}
              placeholder={`${todayOrTheDay}의 날씨`}
              size={15}
              maxLength={15}
            />
            <datalist id="weather-list">
              <option value="맑음 ☀️">맑음 ☀️</option>
              <option value="흐림 ⛅️">흐림 ⛅️</option>
              <option value="비 🌦">비 🌦</option>
              <option value="눈 🌨">눈 🌨</option>
              <option value="소나기 🌧">소나기 🌧</option>
              <option value="태풍 🌪">태풍 🌪</option>
              <option value="안개 🌫">안개 🌫</option>
              <option value="더움 🥵">더움 🥵</option>
              <option value="추움 🥶">추움 🥶</option>
            </datalist> */}
            {weather !== "direct" ? (
              <select
                name="weather"
                className="weather"
                value={weather}
                onChange={onWeatherChange}
              >
                <option
                  value=""
                  disabled
                  defaultChecked
                  style={{ display: "none" }}
                >
                  오늘의 날씨
                </option>
                <option value="">선택 안함</option>
                <option value="맑음 ☀️">맑음 ☀️</option>
                <option value="흐림 ⛅️">흐림 ⛅️</option>
                <option value="비 🌦">비 🌦</option>
                <option value="눈 🌨">눈 🌨</option>
                <option value="소나기 🌧">소나기 🌧</option>
                <option value="태풍 🌪">태풍 🌪</option>
                <option value="안개 🌫">안개 🌫</option>
                <option value="더움 🥵">더움 🥵</option>
                <option value="추움 🥶">추움 🥶</option>
                <option value="direct">직접 입력</option>
              </select>
            ) : (
              <input
                value={directWeather}
                onChange={onDirectWeatherChange}
                className="direct"
                autoFocus
                onBlur={() => {
                  directWeather === "" && setWeather("");
                }}
              />
            )}

            {mood !== "direct" ? (
              <select
                name="mood"
                className="mood"
                value={mood}
                onChange={onMoodChange}
              >
                <option
                  value=""
                  defaultChecked
                  disabled
                  style={{ display: "none" }}
                >
                  오늘의 기분
                </option>
                <option value="">선택 안함</option>
                <option value="보통 😐">보통 😐</option>
                <option value="기쁨 😃">기쁨 😃</option>
                <option value="슬픔 😢">슬픔 😢</option>
                <option value="신남 🥳">신남 🥳</option>
                <option value="설렘 🥰">설렘 🥰</option>
                <option value="긴장 😨">긴장 😨</option>
                <option value="분노 😡">분노 😡</option>
                <option value="멘붕 🤯">멘붕 🤯</option>
                <option value="피곤 🥱">피곤 🥱</option>
                <option value="direct">직접 입력</option>
              </select>
            ) : (
              <input
                value={directMood}
                onChange={onDirectMoodChange}
                className="direct"
                autoFocus
                onBlur={() => {
                  directMood === "" && setMood("");
                }}
              />
            )}

            {/* <input
              className="mood"
              list="mood-list"
              type="text"
              value={mood}
              onChange={onMoodChange}
              placeholder={`${todayOrTheDay}의 기분`}
              size={15}
              maxLength={15}
            />
            <datalist id="mood-list">
              <option value="보통 😐">보통 😐</option>
              <option value="기쁨 😃">기쁨 😃</option>
              <option value="슬픔 😢">슬픔 😢</option>
              <option value="신남 🥳">신남 🥳</option>
              <option value="설렘 🥰">설렘 🥰</option>
              <option value="긴장 😨">긴장 😨</option>
              <option value="분노 😡">분노 😡</option>
              <option value="멘붕 🤯">멘붕 🤯</option>
              <option value="힘듦 😓">힘듦 😓</option>
              <option value="피곤 🥱">피곤 🥱</option>
            </datalist> */}
          </div>
          <textarea
            className="content"
            value={content}
            onChange={onContentChange}
            placeholder={`${todayOrTheDay}의 하루`}
            maxLength={5000}
          />
          <div className="attachment-wrapper">
            <input
              id="attachment-input"
              type="file"
              accept="image/*"
              ref={attachmentInputRef}
              onChange={onAttachmentChange}
            />
            {attachment ||
            (!attachment &&
              editMode &&
              prevDiary &&
              prevDiary.attachmentUrl &&
              !fileEdited) ? (
              <div>
                <Button
                  style={{ marginTop: "10px", padding: "5px 15px" }}
                  onClick={onAttachmentDelete}
                >
                  사진 삭제하기
                </Button>
                <span className="attachment-title">
                  {attachment
                    ? attachment?.name
                    : prevDiary && prevDiary.attachmentId}
                </span>
              </div>
            ) : (
              <label
                id="attachmentLabel"
                htmlFor="attachment-input"
                className={classNames(
                  "attachment-label",
                  "hover-brighter",
                  "hover-bigger"
                )}
              >
                사진 첨부하기
              </label>
            )}
          </div>
        </div>
        <section className="btn-wrapper">
          <Button
            style={{ width: "140px" }}
          >{`${todayOrTheDay}의 일기, 끝`}</Button>
          <Button>
            <Link href={editMode ? `/diary/${queryDate}` : "/"}>
              <a>{editMode ? "돌아가기" : "작성 취소"}</a>
            </Link>
          </Button>
        </section>
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
            word-break: keep-all;
            padding: {
              top: 50px;
              bottom: 30px;
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

          form {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 30px;
            margin-bottom: 60px;

            .input-wrapper {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 20px;

              .etc-input-wrapper {
                display: flex;
                flex-wrap: wrap;
                row-gap: 20px;
                select,
                input {
                  flex-grow: 1;
                  color: $gray-color;
                }
              }

              input,
              textarea,
              label,
              select {
                padding: 10px;
                font: {
                  size: 16px;
                }

                &.title,
                &.weather,
                &.mood,
                &.direct {
                  border-bottom: 1.5px solid $gray-color;
                  margin: 0px 5px;
                  padding-bottom: 3px;
                }

                &.content {
                  min-height: 500px;
                  padding: 15px;
                  border: 1.5px solid $gray-color;
                  border-radius: 5px;
                  flex-grow: 1;
                  margin-top: 20px;
                }
              }

              .attachment-wrapper {
                #attachment-input {
                  display: none;
                }

                .attachment-label {
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

                div {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  row-gap: 0;
                  flex-wrap: wrap;

                  .attachment-title {
                    margin-top: 10px;
                    color: $gray-color;
                  }
                }
              }
            }

            .btn-wrapper {
              display: flex;
              gap: 10px;
              align-self: flex-end;
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
    </section>
  ) : (
    <>
      <Seo />
    </>
  );
};

export default Write;
