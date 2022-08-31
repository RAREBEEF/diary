import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../components/Calendar.module.scss";
import _ from "lodash";
import { useSelector } from "react-redux";
import { reduxStateType } from "../redux/store";
import { useDispatch } from "react-redux";
import { getDiariesThunk } from "../redux/modules/setDiaries";
import { getHoliThunk } from "../redux/modules/setHoli";

/**
 * 연도와 월을 전달하면 해당 연도의 공휴일 데이터와 해당 달의 일기 데이터를 불러와 저장하고 해당 달의 달력을 반환함
 * @param year FullYear
 * @param month 1 ~ 12
 */
const useCalendar = (year: number, month: number) => {
  const {
    calendarData: { init },
    loginData: {
      userData: { uid },
    },
    diariesData: { data: diaries },
    holiData: { data: holi, error: holiError },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const curMonthLastDate = new Date(year, month, 0).getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDay();

  /**
   * 날짜 클릭 이벤트 리스너,
   * 해당 날짜에 일기가 있을 경우 diary로, 없을 경우 wirte로 이동
   * @param i 날짜
   * @param isWrited 작성 여부
   * */
  const onDateClick = (i: number, isWrited: boolean) => {
    router.push(
      {
        pathname: `/${isWrited ? "diary" : "write"}/${year}${
          month < 10 ? "0" + month : month
        }${i < 10 ? "0" + i : i}`,
      },
      `/${isWrited ? "diary" : "write"}/${year}${
        month < 10 ? "0" + month : month
      }${i < 10 ? "0" + i : i}`
    );
  };

  // 연간 공휴일 데이터 불러오기
  // 연도가 바뀔 때 마다 실행됨
  // 해당 연도의 데이터가 이미 있거나 달력이 준비되지 않은 상태일 경우 api를 호출하지 않음
  useEffect(() => {
    if (holi[year] || !init) {
      return;
    }

    dispatch<any>(getHoliThunk(year.toString()));
  }, [year, init, dispatch, holi]);

  // 월별 일기 데이터 불러오기
  // 달력의 월이 바뀔 때 마다 실행됨
  // 해당 월의 데이터가 이미 있거나 달력이 준비되지 않았을 경우 데이터를 가져오지 않음
  useEffect(() => {
    if (
      !year ||
      !month ||
      !uid ||
      !init ||
      (diaries[year] && diaries[year][month < 10 ? "0" + month : month])
    ) {
      return;
    }

    dispatch<any>(
      getDiariesThunk(
        uid,
        year.toString(),
        month < 10 ? "0" + month : month.toString()
      )
    );
  }, [year, month, dispatch, uid, init, diaries]);

  //
  //
  //
  // 달력 생성 과정
  //
  //
  //
  // 1. 달력에 들어갈 모든 칸 추가
  const allDaysArr = [];
  // 1-1. 이전 달 마지막 날의 요일을 알아낸 뒤 달력의 앞 공백(이전 달 날짜들)을 빈칸으로 추가
  // 예시) 이전 달의 마지막 날이 수요일이었다면 첫 주차의 월, 화, 수를 공백으로 채움.
  // 일요일이었을 경우 그냥 넘어감.
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
  // 공휴일과 일기 작성 여부에 따라 클래스 부여
  for (let i = 1; i <= curMonthLastDate; i++) {
    const searchKeyword = `${month < 10 ? "0" + month : month}${
      i < 10 ? "0" + i : i
    }`;

    let isHoli = false;
    let isWrited = false;
    // 공휴일
    if (holi[year] && holi[year].indexOf(searchKeyword) !== -1) {
      isHoli = true;
    }
    // 일기 작성 여부
    if (
      diaries[year] &&
      diaries[year][month < 10 ? "0" + month : month] &&
      diaries[year][month < 10 ? "0" + month : month][
        i < 10 ? "0" + i : i.toString()
      ]
    ) {
      isWrited = true;
    }

    allDaysArr.push(
      <td
        key={i}
        className={classNames(
          styles.item,
          isHoli && styles.holi,
          isWrited && styles.writed
        )}
        onClick={() => {
          onDateClick(i, isWrited);
        }}
      >
        {i}
      </td>
    );
  }

  // 2. 모든 칸을 1주 단위(7개)로 끊어서 table 구조로 저장
  const calendar = [];
  for (let i = 1; i <= 6; i++) {
    // 2-1. 모든 칸을 저장한 배열에서 맨 앞 7개 날짜 가져오기.
    const weekArr = allDaysArr.slice(0, 7);

    // 2-2. 마지막 주차일 경우 뒤쪽의 공백 계산
    // 첫 주차를 제외하고 현재 주차의 날짜 수가 7일에 못미칠 경우 모자란 날짜 수 만큼 해당 주차에 빈 칸 추가
    // 6주차가 없는 달에도 6주차 자리에 모두 빈 칸을 채워 넣는다. 달력의 크기를 항상 일정하게 유지하기 위함.
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

  return calendar;
};

export default useCalendar;
