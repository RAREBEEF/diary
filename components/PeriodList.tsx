import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getPeriodDiariesThunk,
  periodInitialization,
} from "../redux/modules/setDiaries";
import { reduxStateType } from "../redux/store";
import Button from "./Button";

// TODO: 기간 input 추가하기.

// FIXME: periodData 상태가 업데이트 되어도 리렌더링이 발생하지 않음.
// // // useEffect의 dependency로 등록 후 periodData 업데이트 시 useEffect가 트리거 되는걸로 보아서는 React도 스토어의 업데이트 사실을 감지하기는 하는 듯.

const PeriodList = () => {
  const dispatch = useDispatch();
  const {
    loginData: {
      userData: { uid },
    },
    diariesData: { periodData: data },
  } = useSelector((state: reduxStateType): reduxStateType => state);

  /**
   * 기간 내의 일기를 모두 로드한다
   *
   * @param from [시작연도, 시작월], to보다 미래
   * @param to [종료연도, 종료월], from보다 과거
   * */
  const getDiary = (
    from: [string, string] = ["2022", "09"],
    to: [string, string] = ["2021", "05"]
  ) => {
    const fromYear = parseInt(from[0]);
    const fromMonth = parseInt(from[1]);
    const toYear = parseInt(to[0]);
    const toMonth = parseInt(to[1]);
    //  0  <= 1
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
    dispatch(periodInitialization());
    getDiary();
  };

  return (
    <section className="container">
      <div className="inner-wrapper">
        <hgroup>
          <h2>일기 불러오기</h2>
        </hgroup>
        <Button onClick={onLoadClick}>불러오기</Button>
        <section>
          {data.map((diary, i) => (
            <h3 key={i}>{diary.title}</h3>
          ))}
        </section>
      </div>
      <style jsx>{`
        @import "../styles/var.scss";

        section {
          background-color: white;
          box-shadow: 0px -1px 5px #333333;

          .inner-wrapper {
            max-width: 1000px;
            margin: auto;
            padding: {
              left: 50px;
              right: 50px;
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
          }
        }
      `}</style>
    </section>
  );
};

export default PeriodList;
