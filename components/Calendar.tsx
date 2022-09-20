import classNames from "classnames";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useCalendar from "../hooks/useCalendar";
import { setCalendar } from "../redux/modules/setCalendar";
import { setLatestTab } from "../redux/modules/setDiaries";
import { reduxStateType } from "../redux/store";
import Button from "./Button";
import styles from "./Calendar.module.scss";
import LodaingHoliday from "./LoadingHoliday";

const Calendar = () => {
  const dispatch = useDispatch();
  const {
    calendarData: {
      curDate: { year, month },
    },
    holiData: { loading: holiLoading },
  } = useSelector((state: reduxStateType): reduxStateType => state);

  // 달력 불러오기
  const calendar = useCalendar(year, month);

  // 이전 달 버튼 클릭
  const onPrevMonthClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 달력이 1월일 경우 연도를 하나 내리고 12월로 이동
    if (month === 1) {
      dispatch(setCalendar.actions.setCurDate({ year: year - 1, month: 12 }));
      //  아니면 그냥 월만 하나 내림
    } else {
      dispatch(setCalendar.actions.setCurDate({ year, month: month - 1 }));
    }
  };

  // 다음 달 버튼 클릭
  const onNextMonthClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 현재 달력이 12월일 경우 연도를 하나 올리고 1월로 이동
    if (month === 12) {
      dispatch(
        setCalendar.actions.setCurDate({
          year: typeof year !== "number" ? parseInt(year) + 1 : year + 1,
          month: 1,
        })
      );
      //  아니면 그냥 월만 하나 올림
    } else {
      dispatch(setCalendar.actions.setCurDate({ year, month: month + 1 }));
    }
  };

  // 드롭다운 연도 옵션 생성 함수
  // 현재 연도 기준 +-10 범위로 생성
  const yearOptionsGen = () => {
    const yearOptions = [];
    for (let i = -10; i <= 10; i++) {
      yearOptions.push(
        <option
          value={typeof year !== "number" ? parseInt(year) + i : year + i}
          key={year + i}
        >
          {typeof year !== "number" ? parseInt(year) + i : year + i}
        </option>
      );
    }

    return yearOptions;
  };

  // select의 체인지 이벤트 리스너
  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(setCalendar.actions.setCurDate({ year: value, month }));
  };
  const onMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(setCalendar.actions.setCurDate({ year, month: parseInt(value) }));
  };

  /**
   * 컴포넌트 내 아무 곳이나 클릭 시 현재 컴포넌트를 최근 탭으로 저장*/
  const onContainerClick = () => {
    dispatch(setLatestTab(0));
  };

  return (
    <main
      className={classNames(styles.container, "container")}
      onClick={onContainerClick}
    >
      <nav className={styles.nav}>
        <Button onClick={onPrevMonthClick} style={{ border: "none" }}>
          <Image
            src="/icons/angle-left-solid.svg"
            width={25}
            height={25}
            alt="Previous month"
          />
        </Button>
        <div>
          <select onChange={onYearChange} value={year}>
            {yearOptionsGen().map((el) => el)}
          </select>
          <select onChange={onMonthChange} value={month}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
          </select>
        </div>
        <Button onClick={onNextMonthClick} style={{ border: "none" }}>
          <Image
            src="/icons/angle-left-solid.svg"
            width={25}
            height={25}
            alt="Next month"
          />
        </Button>
      </nav>
      <table>
        <thead>
          <tr>
            <th>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th>SAT</th>
          </tr>
        </thead>
        <tbody>{calendar.map((el) => el)}</tbody>
      </table>
      <LodaingHoliday isShow={holiLoading} />
    </main>
  );
};

export default Calendar;
