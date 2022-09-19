import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import {
  getPeriodDiariesThunk,
  periodInitialization,
  setLatestTab,
  setPeriodPage,
} from "../redux/modules/setDiaries";
import { reduxStateType } from "../redux/store";
import { DiaryType } from "../type";
import Button from "./Button";

const PeriodList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    calendarData: { today },
    loginData: {
      isLoggedIn,
      userData: { uid },
    },
    diariesData: { periodData: data, error, periodPage },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const { value: fromDate, onChange: onFromDateChange } = useInput(
    `${today.year}-${today.month}`
  );
  const { value: toDate, onChange: onToDateChange } = useInput(``);
  const [pages, setPages] = useState<Array<Array<DiaryType>>>([]);

  /**
   * 기간 내의 일기를 모두 로드한다
   *
   * @param from [시작연도, 시작월], to보다 미래
   * @param to [종료연도, 종료월], from보다 과거
   * */
  const getDiary = (from: [string, string], to: [string, string]) => {
    const fromYear = parseInt(from[0]);
    const fromMonth = parseInt(from[1]);
    const toYear = parseInt(to[0]);
    const toMonth = parseInt(to[1]);

    for (let y = 0; y <= fromYear - toYear; y++) {
      for (let m = 12; m >= 1; m--) {
        // from 연도의 시작 월 찾기
        if (y === 0 && m === 12 && fromMonth !== 12) {
          m = fromMonth;
        }

        dispatch<any>(
          getPeriodDiariesThunk(
            uid,
            (fromYear - y).toString(),
            m < 10 ? "0" + m : m.toString()
          )
        );

        // to 연도의 종료 월 찾기
        if (fromYear - y === toYear && m === toMonth) {
          break;
        }
      }
    }
  };

  /**
   * 로드 버튼 클릭
   *
   * period 데이터를 초기화 후 새로 불러온다.*/
  const onLoadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (fromDate === "" || toDate === "") {
      window.alert("기간을 입력해 주세요.");
      return;
    }

    dispatch(periodInitialization());
    const from = [fromDate.slice(0, 4), fromDate.slice(5, 7)];
    const to = [toDate.slice(0, 4), toDate.slice(5, 7)];

    // @ts-ignore
    getDiary(from, to);
    dispatch(setPeriodPage(0));
  };
  // 페이지네이션,
  // 받아온 데이터를 20개씩 끊어서 배열에 저장
  useEffect(() => {
    const pagesArr: Array<any> = [];
    const originalArr = [...data];

    originalArr.forEach((diary, i) => {
      pagesArr.push([...originalArr.slice(i, i + 10)]);
      originalArr.splice(0, 9);
    });

    setPages(pagesArr);
  }, [data]);

  // 페이지네이션 네비게이션
  const onPrevPageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (periodPage === 0) {
      return;
    }

    dispatch(setPeriodPage(periodPage - 1));
  };
  const onNextPageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (periodPage === pages.length - 1) {
      return;
    }

    dispatch(setPeriodPage(periodPage + 1));
  };

  /**
   * 컴포넌트 내 아무 곳이나 클릭 시 현재 컴포넌트를 최근 탭으로 저장*/
  const onContainerClick = () => {
    dispatch(setLatestTab(1));
  };

  return (
    <section className="container" onClick={onContainerClick}>
      <div className="inner-wrapper">
        <h2>일기 모아보기</h2>
        <nav className="nav--period">
          <div className="inputs-wrapper">
            <div className={classNames("input-wrapper", "hover-brighter")}>
              <label htmlFor="from-input">From</label>
              <input
                type="month"
                id="from-input"
                value={fromDate}
                onChange={onFromDateChange}
                max={`${today.year}-${today.month}`}
                min={toDate}
              />
              {/* <div className="icon--calendar">
                <Image
                  src="/icons/calendar-solid.svg"
                  width={20}
                  height={20}
                  alt={"From date"}
                />
              </div> */}
            </div>
            <div className={classNames("input-wrapper", "hover-brighter")}>
              <label htmlFor="to-input">to</label>
              <input
                type="month"
                id="to-input"
                value={toDate}
                onChange={onToDateChange}
                max={fromDate}
                min={"1960-01"}
              />
              {/* <div className="icon--calendar">
                <Image
                  src="/icons/calendar-solid.svg"
                  width={20}
                  height={20}
                  alt={"From date"}
                />
              </div> */}
            </div>
          </div>

          <Button onClick={onLoadClick} style={{ borderRadius: "10px" }}>
            불러오기
          </Button>
        </nav>

        <section className="diaries">
          <ul>
            {error ? (
              <p className="fail">로드 실패</p>
            ) : pages.length === 0 ? (
              <p className="empty">비어있음</p>
            ) : (
              pages[periodPage]?.map((diary, i) => (
                <li key={i} className="hover-bigger">
                  <Link href={`/diary/${diary.date}`}>
                    <a className="link">
                      <h3 className="diary-title">{diary.title}</h3>
                      <div className="diary-date">{`${diary.date.slice(
                        0,
                        4
                      )}/${diary.date.slice(4, 6)}/${diary.date.slice(
                        6
                      )}`}</div>
                    </a>
                  </Link>
                </li>
              ))
            )}
          </ul>

          {pages.length !== 0 && (
            <nav className={classNames("nav--pagination", "no-drag")}>
              <Button
                style={{
                  border: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: periodPage === 0 ? "none" : "all",
                  cursor: periodPage === 0 ? "default" : "pointer",
                  filter: periodPage === 0 ? "brightness(2)" : "none",
                }}
                onClick={onPrevPageClick}
              >
                <Image
                  src="/icons/angle-left-solid.svg"
                  width={20}
                  height={20}
                  alt="Previous month"
                />
              </Button>
              <div>
                {pages.map((el, i) => {
                  const length = pages.length;
                  const btnPage = (
                    <span
                      className="btn--page"
                      key={i + 1}
                      onClick={() => {
                        dispatch(setPeriodPage(i));
                      }}
                      style={{
                        color: periodPage === i ? "lightgray" : "inherit",
                        cursor: periodPage === i ? "default" : "pointer",
                        pointerEvents: periodPage === i ? "none" : "all",
                      }}
                    >
                      {i + 1}
                    </span>
                  );

                  if (
                    i === periodPage ||
                    (i >= periodPage - 3 && i <= periodPage + 3) ||
                    (periodPage < 4 && i < 7) ||
                    (periodPage > length - 4 && length - 7 <= i)
                  ) {
                    return btnPage;
                  }
                })}
              </div>
              <Button
                style={{
                  border: "none",
                  transform: "rotate(180deg)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents:
                    periodPage === pages.length - 1 ? "none" : "all",
                  cursor:
                    periodPage === pages.length - 1 ? "default" : "pointer",
                  filter:
                    periodPage === pages.length - 1 ? "brightness(2)" : "none",
                }}
                onClick={onNextPageClick}
              >
                <Image
                  src="/icons/angle-left-solid.svg"
                  width={20}
                  height={20}
                  alt="Next month"
                />
              </Button>
            </nav>
          )}
        </section>
      </div>

      <style jsx>{`
        @import "../styles/var.scss";

        .container {
          background-color: white;
          box-shadow: 0px -1px 5px #333333;
          height: auto !important;

          .inner-wrapper {
            max-width: 1000px;
            margin: auto;
            padding: {
              left: 50px;
              right: 50px;
              bottom: 250px;
            }

            h2 {
              width: fit-content;
              width: 100%;
              max-width: 1000px;
              margin: auto;
              padding: {
                top: 50px;
              }
              width: fit-content;
              color: $gray-color;
              margin-top: 20px;
              font: {
                size: 30px;
                weight: 700;
              }
            }

            .nav--period {
              margin: 50px auto 30px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 20px;

              .inputs-wrapper {
                color: rgb(100, 100, 100, 0.8);
                display: flex;
                justify-content: center;
                gap: 20px;
                row-gap: 30px;
                flex-wrap: wrap;

                .input-wrapper {
                  position: relative;
                  height: fit-content;

                  input {
                    min-width: fit-content;
                    border: 1px solid $gray-color;
                    border-radius: 15px;
                    padding: 5px 10px;
                    height: 35px;
                    /* width: 125px; */
                    cursor: pointer;
                    /* &::-webkit-calendar-picker-indicator {
                      opacity: 0;
                      display: none;
                      cursor: pointer;
                    }
                    &::-webkit-clear-button,
                    &::-webkit-inner-spin-button {
                      display: none;
                      opacity: 0;
                      cursor: pointer;
                    } */
                  }

                  label {
                    position: absolute;
                    top: -22.5px;
                    left: 5px;
                  }

                  .icon--calendar {
                    pointer-events: none;
                    height: fit-content;
                    position: absolute;
                    top: 3px;
                    bottom: 0;
                    right: 7.5px;
                    margin: auto;
                  }
                }
              }

              * {
                font: {
                  size: 16px;
                  weight: 500;
                }
              }
            }

            .diaries {
              .empty,
              .fail {
                text-align: center;
              }
              ul {
                li {
                  border-bottom: 0.5px solid $gray-color;
                  margin-bottom: 10px;
                  .link {
                    display: flex;
                    justify-content: space-between;
                    .diary-title,
                    .diary-date {
                      margin: 10px;
                    }
                    .diary-title {
                      flex-grow: 1;
                    }
                    .diary-date {
                      flex-shrink: 0;
                    }
                  }
                }
              }

              .nav--pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 30px auto;
                .btn--page {
                  color: $gray-color;
                  padding: 2.5px;
                  margin: 0 2.5px;
                  cursor: pointer;
                }
              }
            }
          }
        }

        @media all and (max-width: 380px) {
          .container {
            .inner-wrapper {
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

export default PeriodList;
