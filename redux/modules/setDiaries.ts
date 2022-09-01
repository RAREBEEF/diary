import { collection, getDocs, query } from "firebase/firestore";
import React from "react";
import { db } from "../../fb";

// 데이터 구조 예시
// {
//   "2021": {
//     "06": {
//       "15": { title: "제목", content: "내용" },
//       "13": { title: "제목", content: "내용" },
//     },
//     "07": { "23": { title: "제목", content: "내용" } },
//     "08": {
//       "28": { title: "제목", content: "내용" },
//       "31": { title: "제목", content: "내용" },
//     },
//   },
//   "2022": {
//     "06": {
//       "15": { title: "제목", content: "내용" },
//       "13": { title: "제목", content: "내용" },
//     },
//     "07": { "23": { title: "제목", content: "내용" } },
//     "08": {
//       "28": { title: "제목", content: "내용" },
//       "31": { title: "제목", content: "내용" },
//     },
//   },
// };

export interface DiariesDataStateType {
  data: any;
  loading: boolean;
  error: any;
}

export const GET_DIARIES_START = "GET_DIARIES_START";
export const GET_DIARIES_SUCCESS = "GET_DIARIES_SUCCESS";
export const GET_DIARIES_FAIL = "GET_DIARIES_FAIL";
export const DIARY_INITIALIZATION = "DIARY_INITIALIZATION";

const getDiariesStart = () => {
  return {
    type: GET_DIARIES_START,
  };
};

const getDiariesSuccess = (data: any, year: string, month: string) => {
  return {
    type: GET_DIARIES_SUCCESS,
    data,
    year,
    month,
  };
};

const getDiariesFail = (error: any, year: string, month: string) => {
  return {
    type: GET_DIARIES_FAIL,
    error,
    year,
    month,
  };
};

export const diaryInitialization = () => {
  return {
    type: DIARY_INITIALIZATION,
  };
};

export const getDiariesThunk = (uid: string, year: string, month: string) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getDiariesStart());

      if (!window.navigator.onLine) {
        throw "Lost internet connection";
      }

      await getDocs(query(collection(db, uid, year, month))).then((docSnap) => {
        const dailyData: any = {};
        const monthlyData: any = {};
        const finalData: any = {};

        docSnap.forEach((doc) => {
          dailyData[doc.id] = doc.data();
        });

        monthlyData[month] = dailyData;
        finalData[year] = monthlyData;

        dispatch(getDiariesSuccess(finalData, year, month));
      });
    } catch (error) {
      window.alert(
        `일기 데이터를 불러오는데 실패하였습니다.\n통신 상태를 확인해 주세요.`
      );
      dispatch(getDiariesFail(error, year, month));
    }
  };
};

const reducer = (prev = initialState, action: any) => {
  switch (action.type) {
    case GET_DIARIES_START: {
      return { ...prev, loading: true, error: null };
    }

    case GET_DIARIES_SUCCESS: {
      let data: any = { ...prev.data };
      let mergedData: any = {};
      const year: string = action.year;
      const month: string = action.month;

      // 해당 연도에 다른 월 데이터가 이미 있을 경우 덮어쓰여져서 데이터가 사라지는 것을 방지
      if (data[year]) {
        mergedData = { ...data[year][month], ...action.data[year][month] };
        data[year][month] = { ...mergedData };
      } else {
        data = { ...data, ...action.data };
      }

      return {
        loading: false,
        error: null,
        data,
      };
    }

    case GET_DIARIES_FAIL: {
      const data: any = { ...prev.data };
      const monthlyData: any = {};
      monthlyData[action.month] = {};
      data[action.year] = { ...data[action.year], ...monthlyData };

      return {
        loading: false,
        error: action.error,
        data,
      };
    }

    case DIARY_INITIALIZATION: {
      return {
        data: {},
        loading: false,
        error: null,
      };
    }

    default:
      return prev;
  }
};

const initialState = {
  data: {},
  loading: false,
  error: null,
};

export default reducer;
