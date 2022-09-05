import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React from "react";
import { db, storage } from "../../fb";
import { v4 as uuidv4 } from "uuid";

export interface DiariesDataStateType {
  data: any;
  loading: boolean;
  error: any;
}

export const GET_DIARIES_START = "GET_DIARIES_START";
export const GET_DIARIES_SUCCESS = "GET_DIARIES_SUCCESS";
export const GET_DIARIES_FAIL = "GET_DIARIES_FAIL";
export const SET_DIARY_START = "SET_DIARY_START";
export const SET_DIARY_SUCCESS = "SET_DIARY_SUCCESS";
export const SET_DIARY_FAIL = "SET_DIARY_FAIL";
export const DELETE_DIARY_START = "DELETE_DIARY_START";
export const DELETE_DIARY_SUCCESS = "DELETE_DIARY_SUCCESS";
export const DELETE_DIARY_FAIL = "DELETE_DIARY_FAIL";
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

export const setDiaryStart = () => {
  return {
    type: SET_DIARY_START,
  };
};

export const setDiarySuccess = (
  year: string,
  month: string,
  date: string,
  diaryData: any
) => {
  return {
    type: SET_DIARY_SUCCESS,
    year,
    month,
    date,
    diaryData,
  };
};

export const setDiaryFail = (error: any) => {
  return {
    type: SET_DIARY_FAIL,
    error,
  };
};

export const deleteDiaryStart = () => {
  return {
    type: DELETE_DIARY_START,
  };
};

export const deleteDiarySuccess = (
  year: string,
  month: string,
  date: string
) => {
  return {
    type: DELETE_DIARY_SUCCESS,
    year,
    month,
    date,
  };
};

export const deleteDiaryFail = (error: any) => {
  return {
    type: DELETE_DIARY_FAIL,
    error,
  };
};

export const diaryInitialization = () => {
  return {
    type: DIARY_INITIALIZATION,
  };
};

export const setDiaryThunk = (
  diaryData: any,
  attachment: File | null,
  uid: string,
  year: string,
  month: string,
  date: string,
  setRedirectToDiary: Function
) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(setDiaryStart());

      // 첨부 이미지가 존재할 경우
      // 스토리지에 이미지 업로드 후 url 받아온다.
      if (attachment) {
        diaryData.attachmentId = uuidv4();

        const storageRef = ref(storage, `${uid}/${diaryData.attachmentId}`);

        await uploadBytes(storageRef, attachment);

        diaryData.attachmentUrl = await getDownloadURL(storageRef);
      }

      // 업로드
      await setDoc(doc(db, uid, year, month, date), diaryData);
      dispatch(setDiarySuccess(year, month, date, diaryData));
      setRedirectToDiary(true);
    } catch (error) {
      window.alert(
        `일기 업로드에 실패하였습니다.\n잠시 후 다시 시도해 주세요.`
      );

      dispatch(setDiaryFail(error));
    }
  };
};

export const deleteDiaryThunk = (
  attachmentId: string,
  uid: string,
  year: string,
  month: string,
  date: string
) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(deleteDiaryStart());

      if (attachmentId) {
        const storageRef = ref(storage, `${uid}/${attachmentId}`);
        await deleteObject(storageRef);
      }

      deleteDoc(doc(db, uid, year, month, date));
      dispatch(deleteDiarySuccess(year, month, date));
    } catch (error) {
      window.alert(`삭제에 실패하였습니다.\n잠시 후 다시 시도해 주세요.`);
      dispatch(deleteDiaryFail(error));
    }
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

    case SET_DIARY_START: {
      return {
        ...prev,
        loading: true,
        error: null,
      };
    }

    case SET_DIARY_SUCCESS: {
      const data: any = { ...prev.data };

      data[action.year][action.month][action.date] = action.diaryData;

      return {
        ...prev,
        loading: false,
        error: null,
      };
    }

    case SET_DIARY_FAIL: {
      return {
        ...prev,
        loading: false,
        error: action.error,
      };
    }

    case DELETE_DIARY_START: {
      return {
        ...prev,
        loading: true,
        error: null,
      };
    }

    case DELETE_DIARY_SUCCESS: {
      const data: any = { ...prev.data };

      delete data[action.year][action.month][action.date];

      return {
        ...prev,
        loading: false,
        error: null,
      };
    }

    case DELETE_DIARY_FAIL: {
      return {
        ...prev,
        loading: false,
        error: action.error,
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
