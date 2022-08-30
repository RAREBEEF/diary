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

const getDiariesSuccess = (data: any, year: string, month: string) => {
  return {
    type: GET_DIARIES_SUCCESS,
    data,
    year,
    month,
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

      dispatch(getDiariesSuccess);
    } catch (error) {
      console.log(error);
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
      let data: any = { ...prev.data };
      let mergedData: any = {};
      const year: string = action.year;
      const month: string = action.month;

      if (data[year]) {
        // mergedData = {08: {title, content}, 09: {title, content}}
        mergedData = { ...data[year][month], ...action.data[year][month] };
        data[year][month] = { ...mergedData };
      } else {
        data = { ...data, ...action.data };
      }

      console.log(data);

      return {
        loading: false,
        error: null,
        data,
      };
    }
    case GET_DIARIES_FAIL: {
      return {
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
