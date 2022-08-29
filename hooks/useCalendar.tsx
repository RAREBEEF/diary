import classNames from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import styles from "../components/Calendar.module.scss";
import * as xml2js from "xml2js";
import _ from "lodash";
import { useSelector } from "react-redux";
import { reduxStateType } from "../redux/store";
import { setCalendar } from "../redux/modules/setCalendar";
import { useDispatch } from "react-redux";
import { getDiariesThunk } from "../redux/modules/setDiaries";

/**
 * 연도와 월을 전달하면 해당 달의 달력 배열을 반환함
 * @param year FullYear
 * @param month 1 ~ 12
 */
const useCalendar = (year: number, month: number) => {
  const {
    calendarData: { holi },
    loginData: {
      userData: { uid },
    },
    diariesData: { data: diaries },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const curMonthLastDate = new Date(year, month, 0).getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDay();

  // 1. 달력에 들어갈 빈 칸을 포함한 모든 칸 추가
  const allDaysArr = [];
  // 1-1. 이전 달 마지막 날의 요일을 알아낸 뒤 달력의 앞 공백(이전 달 날짜들)을 빈칸으로 추가
  // 이전 달의 마지막 날이 수요일이었다면 첫 주차의 월, 화, 수를 공백으로 채움.
  // 단, 일요일이었을 경우 그냥 넘어감.
  if (prevMonthLastDay !== 6) {
    for (let i = 0; i <= prevMonthLastDay; i++) {
      allDaysArr.push(
        <td
          key={`empty-${i}`}
          className={classNames(styles.item, styles.empty)}
        />
      );
    }
  }
  // 1-2. 이번 달의 모든 날짜 추가
  for (let i = 1; i <= curMonthLastDate; i++) {
    const searchKeyword = `${month < 10 ? "0" + month : month}${
      i < 10 ? "0" + i : i
    }`;
    if (holi[year] && holi[year].indexOf(searchKeyword) !== -1) {
      allDaysArr.push(
        <td
          key={i}
          className={classNames(styles.item, styles.holi)}
          onClick={() => {
            onDateClick(i);
          }}
        >
          {i}
        </td>
      );
    } else {
      allDaysArr.push(
        <td
          key={i}
          className={styles.item}
          onClick={() => {
            onDateClick(i);
          }}
        >
          {i}
        </td>
      );
    }
  }

  // 2. 모든 칸을 1주 단위(7개)로 끊어서 table 구조로 저장
  const calendar = [];
  for (let i = 1; i <= 6; i++) {
    // 2-1. 맨 앞 7개 날짜 가져오기.
    const weekArr = allDaysArr.slice(0, 7);

    // 2-2. 뒤쪽의 공백 채우기
    // 첫 주차를 제외하고 현재 주차의 날짜 수가 7일에 못미칠 경우 모자란 날짜 수 만큼 해당 주차에 빈 칸 추가
    // 6주차가 없어도 항상 빈 칸을 채워 넣는데, 달력의 크기를 항상 일정하게 유지하기 위함.
    const empty = 7 - weekArr.length;
    if (i !== 1 && empty !== 0) {
      for (let j = 1; j <= empty; j++) {
        weekArr.push(
          <td
            key={`empty-${j}`}
            className={classNames(styles.item, styles.empty)}
          />
        );
      }
    }

    // 2-3. 완성된 한 주를 반환할 배열에 추가
    calendar.push(<tr key={i}>{weekArr.map((el) => el)}</tr>);

    // 2-4. 추가된 날짜는 기존 배열에서 삭제
    allDaysArr.splice(0, 7);
  }

  // 날짜 클릭 이벤트 리스너
  const onDateClick = (i: number) => {
    router.push(
      {
        pathname: `/diary/${year}${month < 10 ? "0" + month : month}${
          i < 10 ? "0" + i : i
        }`,
        query: {
          id: uid,
        },
      },
      `/diary/${year}${month < 10 ? "0" + month : month}${i < 10 ? "0" + i : i}`
    );
  };

  /**
   * 현재 달력 연도의 공휴일을 불러와서 저장하는 함수
   * */
  const getHoli = useCallback(async () => {
    await fetch(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&numOfRows=100&ServiceKey=${process.env.NEXT_PUBLIC_HOLIDAY_API_KEY}`
    )
      .then((response) => response.text())
      .then((data) => {
        let parseString = xml2js.parseString;

        parseString(data, function (err: any, result: any) {
          const arr = result.response.body[0].items[0].item.map((el: any) =>
            el.locdate[0].slice(4)
          );
          const prevHoli = { ...holi };
          prevHoli[year] = arr;
          dispatch(setCalendar.actions.setHoli(prevHoli));
        });
      })
      .catch((error: any) => {
        window.alert("공휴일 데이터를 불러오는데 실패하였습니다.");
      });
  }, [dispatch, holi, year]);

  // 달력의 연도가 바뀔 때 해당 연도의 공휴일 데이터가 이미 있거나
  // 달력이 준비되지 않은 상태일 경우 api를 호출하지 않음
  useEffect(() => {
    if (Object.keys(holi).indexOf(year.toString()) !== -1 || year === -1) {
      return;
    }

    getHoli();
  }, [getHoli, holi, year]);

  // 해당 월의 모든 일기 불러오기
  useEffect(() => {
    if (!year || !month || !uid) {
      return;
    }

    dispatch<any>(
      getDiariesThunk(
        uid,
        year.toString(),
        month < 10 ? "0" + month : month.toString()
      )
    );
  }, [year, month, dispatch, uid]);

  console.log(diaries);

  return calendar;
};

export default useCalendar;
