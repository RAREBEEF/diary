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
import Image from "next/image";

const Write = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const movieSearchListRef = useRef<HTMLUListElement>(null);
  const movieSelectedListRef = useRef<HTMLUListElement>(null);
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
    value: mood,
    setValue: setMood,
    onChange: onMoodChange,
  } = useInput("");
  const {
    value: movieKeyword,
    setValue: setMovieKeyword,
    onChange: onMovieKeywordChange,
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
  const [movieResult, setMovieResult] = useState<any>();
  const [selectedMovies, setSelectedMovies] = useState<Array<any>>([]);
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
      setSelectedMovies(prev.movies ? prev.movies : []);
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
      weather,
      mood,
      content,
      movies: selectedMovies,
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

  /**
   * 영화 검색
   */
  const getMovie = async (keyword: string = movieKeyword, page: number = 1) => {
    const url = `api/movie/${keyword}/${page}`;

    await fetch(url)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMovieResult({
          keyword,
          result,
          getNextMovie: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            movieSearchListRef.current?.scrollTo({
              left: 0,
              behavior: "smooth",
            });
            getMovie(movieKeyword, page + 1);
          },
          getPrevMovie: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            movieSearchListRef.current?.scrollTo({
              left: 0,
              behavior: "smooth",
            });
            getMovie(movieKeyword, page - 1);
          },
        });
      });
  };

  // 검색 버튼 크릭
  const onSearchMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (movieKeyword.length === 0) return;
    getMovie();
  };

  // 영화 추가
  const onAddMovie = (movie: any) => {
    setSelectedMovies((prev) => [...prev, movie]);
  };

  // 영화 제거
  const onRemoveMovie = (i: number) => {
    setSelectedMovies((prev) => {
      const prevMovies = [...prev];
      prevMovies.splice(i, 1);
      return prevMovies;
    });
  };

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
            <input
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
            </datalist>
            <input
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
              <option value="피곤 🥱">피곤 🥱</option>
            </datalist>
          </div>

          <div className="movie-wrapper">
            <div className="search">
              <h4>영화 찾기</h4>
              <div className="input-wrapper">
                <input
                  className="movie"
                  list="movie-list"
                  type="text"
                  value={movieKeyword}
                  onChange={onMovieKeywordChange}
                  placeholder={`제목`}
                  size={15}
                />
                <Button onClick={onSearchMovie}>검색</Button>
              </div>
              {movieResult && (
                <>
                  <p>
                    &quot;{movieResult.keyword}&quot; 검색 결과 (
                    {movieResult.result.total_results}건)
                  </p>
                  <ul className="movie-list" ref={movieSearchListRef}>
                    {movieResult.result.page !== 1 && (
                      <Button onClick={movieResult.getPrevMovie}>이전</Button>
                    )}
                    {movieResult?.result?.results?.map(
                      (movie: any, i: number) => (
                        <li
                          key={i}
                          className="movie-item"
                          onClick={() => {
                            onAddMovie(movie);
                          }}
                        >
                          {movie.image !== "" && (
                            <Image
                              src={
                                "https://image.tmdb.org/t/p/w500" +
                                movie.poster_path
                              }
                              alt={movie.title}
                              width={500}
                              height={750}
                              objectFit="contain"
                              layout="responsive"
                            />
                          )}
                          <h5>{movie.title}</h5>
                        </li>
                      )
                    )}
                    {movieResult.result.page !==
                      movieResult.result.total_pages &&
                      movieResult.result.total_pages !== 0 && (
                        <Button onClick={movieResult.getNextMovie}>다음</Button>
                      )}
                  </ul>
                </>
              )}
            </div>
            <div className="selected">
              <h3>오늘 본 영화</h3>
              <ul className="movie-list" ref={movieSelectedListRef}>
                {selectedMovies.length === 0 ? (
                  <p className="empty">비어있음</p>
                ) : (
                  selectedMovies.map((movie: any, i) => (
                    <li
                      key={i}
                      className="movie-item"
                      onClick={() => {
                        onRemoveMovie(i);
                      }}
                    >
                      {movie.image !== "" && (
                        <Image
                          src={
                            "https://image.tmdb.org/t/p/original" +
                            movie.poster_path
                          }
                          alt={movie.title}
                          width={500}
                          height={750}
                          objectFit="contain"
                          layout="responsive"
                        />
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
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
                }
              }

              .movie-wrapper {
                border: 1.5px solid $gray-color;
                border-radius: 5px;
                padding: 10px;
                margin-top: 20px;

                .input-wrapper {
                  flex-direction: row;
                  align-items: center;
                  gap: 10px;
                  margin-bottom: 20px;
                }

                .selected {
                  margin-top: 20px;
                  .movie-list {
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    padding-bottom: 10px;
                    .movie-item {
                      min-width: 80px !important;
                      max-width: 80px !important;
                    }
                  }
                }

                h3 {
                  color: $gray-color;
                  margin-bottom: 10px;
                  font: {
                    size: 20px;
                    weight: 700;
                  }
                }

                h4 {
                  color: $gray-color;
                  margin-bottom: 10px;
                  font: {
                    size: 20px;
                    weight: 700;
                  }
                }

                p {
                  color: $gray-color;
                  margin: 10px 10px;
                  font: {
                    size: 16px;
                  }

                  &.empty {
                    text-align: center;
                    width: 100%;
                  }
                }

                .movie-list {
                  width: 100%;
                  overflow-x: scroll;
                  display: flex;
                  align-items: center;
                  gap: 30px;
                  padding: {
                    left: 10px;
                    right: 10px;
                    bottom: 20px;
                  }

                  .movie-item {
                    position: relative;
                    cursor: pointer;
                    border-radius: 5px;
                    min-width: 150px;
                    display: inline;
                    padding: 5px;
                    box-shadow: 3px 3px 5px $gray-color;

                    h5 {
                      position: absolute;
                      bottom: 20px;
                      left: 0;
                      right: 0;
                      width: fit-content;
                      max-width: 80%;
                      margin: auto;
                      word-break: keep-all;
                      text-align: center;
                      background-color: rgba(0, 0, 0, 0.8);
                      color: white;
                      padding: 5px 10px;
                      border-radius: 15px;
                      font: {
                        weight: 700;
                      }
                    }
                  }
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
                &.direct,
                &.movie {
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
