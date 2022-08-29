import { collection, getDocs, query } from "firebase/firestore";
import React from "react";
import { db } from "../../fb";

// 데이터 구조
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

const getDiariesStart = () => {
  return {
    type: GET_DIARIES_START,
  };
};

const getDiariesSuccess = (data: any) => {
  return {
    type: GET_DIARIES_SUCCESS,
    data,
  };
};

const getDiariesFail = (error: any) => {
  return {
    type: GET_DIARIES_FAIL,
    error,
  };
};

export const getDiariesThunk = (uid: string, year: string, month: string) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getDiariesStart());

      await getDocs(query(collection(db, uid, year, month))).then((docSnap) => {
        const yearlyData: any = {};
        const monthlyData: any = {};
        const dailyData: any = {};

        docSnap.forEach((doc) => {
          dailyData[doc.id] = doc.data();
        });

        monthlyData[month] = dailyData;
        yearlyData[year] = monthlyData;

        dispatch(getDiariesSuccess(yearlyData));
      });

      dispatch(getDiariesSuccess);
    } catch (error) {
      dispatch(getDiariesFail);
    }
  };
};

const reducer = (prev = initialState, action: any) => {
  switch (action.type) {
    case GET_DIARIES_START: {
      return { ...prev, loading: true, error: null };
    }
    case GET_DIARIES_SUCCESS: {
      return {
        ...prev,
        loading: false,
        error: null,
        data: { ...prev.data, ...action.data },
      };
    }
    case GET_DIARIES_FAIL: {
      return {
        ...prev,
        loading: false,
        error: action.error,
        data: {},
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
