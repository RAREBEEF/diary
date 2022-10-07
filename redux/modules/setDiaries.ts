import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
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
import { DiaryType } from "../../type";

export interface DiariesDataStateType {
  /**
   * 일기 데이터, 달력과 "/diary" 페이지의 일기 출력에 사용
   * */
  data: any;
  /**
   * 기간별 일기 목록 데이터
   * */
  periodData: Array<DiaryType>;
  tags: any;
  /**
   * 기간별 일기 목록의 현재 페이지
   * */
  periodPage: number;
  loading: boolean;
  error: any;
  /**
   * 홈화면에서 가장 마지막에 사용한 탭(달력, 기간별 일기 목록).
   *
   * 다른 페이지에서 홈으로 돌아왔을 때 해당 탭을 바로 출력하기 위함.
   * */
  latestTab: number;
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
export const PERIOD_INITIALIZATION = "PERIOD_INITIALIZATION";
export const GET_PERIOD_START = "GET_PERIOD_START";
export const GET_PERIOD_SUCCESS = "GET_PERIOD_SUCCESS";
export const GET_PERIOD_FAIL = "GET_PERIOD_FAIL";
export const GET_TAGS_START = "GET_TAGS_START";
export const GET_TAGS_SUCCESS = "GET_TAGS_SUCCESS";
export const GET_TAGS_FAIL = "GET_TAGS_FAIL";
export const SET_PERIOD_PAGE = "SET_PERIOD_PAGE";
export const SET_LATEST_TAB = "SET_LATEST_TAB";

export const getDiariesStart = () => {
  return {
    type: GET_DIARIES_START,
  };
};

export const getDiariesSuccess = (data: any, year: string, month: string) => {
  return {
    type: GET_DIARIES_SUCCESS,
    data,
    year,
    month,
  };
};

export const getDiariesFail = (error: any, year: string, month: string) => {
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

export const periodInitialization = () => {
  return {
    type: PERIOD_INITIALIZATION,
  };
};

export const getPeriodStart = () => {
  return {
    type: GET_PERIOD_START,
  };
};

export const getPeriodSuccess = (periodData: Array<DiaryType>) => {
  return {
    type: GET_PERIOD_SUCCESS,
    periodData,
  };
};

export const getPeriodFail = (error: any) => {
  return {
    type: GET_PERIOD_FAIL,
    error,
  };
};
export const getTagsStart = () => {
  return {
    type: GET_TAGS_START,
  };
};

export const getTagsSuccess = (tagData: Array<any>) => {
  return {
    type: GET_TAGS_SUCCESS,
    tagData,
  };
};

export const getTagsFail = (error: any) => {
  return {
    type: GET_TAGS_FAIL,
    error,
  };
};

export const setPeriodPage = (periodPage: number) => {
  return {
    type: SET_PERIOD_PAGE,
    periodPage,
  };
};
export const setLatestTab = (latestTab: number) => {
  return {
    type: SET_LATEST_TAB,
    latestTab,
  };
};

export const setDiaryThunk = (
  diaryData: DiaryType,
  prevDiary: DiaryType | null,
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

      // 태그가 존재할 경우
      if (diaryData.tags?.length !== 0) {
        diaryData.tags.forEach(async (tag) => {
          const newTags: any = {};
          newTags[tag] = arrayUnion(`${year}${month}${date}`);

          await updateDoc(doc(db, uid, "tags"), newTags).catch(
            async (error) => {
              switch (error.code) {
                // "tags" 컬렉션이 없는 경우 추가
                case "not-found":
                  await setDoc(doc(db, uid, "tags"), newTags);
                default:
                  break;
              }
            }
          );
        });
      }

      // 이전 태그 삭제
      if (
        prevDiary &&
        prevDiary.tags &&
        prevDiary.tags.length !== 0 &&
        prevDiary.tags !== diaryData.tags
      ) {
        // 차집합 구하기
        const deleteList: Array<any> | undefined = prevDiary?.tags.filter(
          (tag) => !diaryData.tags.includes(tag)
        );

        deleteList?.forEach(async (tag) => {
          const newTags: any = {};
          newTags[tag] = arrayRemove(`${year}${month}${date}`);

          await updateDoc(doc(db, uid, "tags"), newTags);
        });
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
  tags: Array<string>,
  uid: string,
  year: string,
  month: string,
  date: string
) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(deleteDiaryStart());

      // 첨부파일이 존재할 경우
      if (attachmentId) {
        const storageRef = ref(storage, `${uid}/${attachmentId}`);
        await deleteObject(storageRef);
      }

      // 태그가 존재할 경우
      if (tags.length !== 0) {
        tags.forEach(async (tag) => {
          const newTags: any = {};
          newTags[tag] = arrayRemove(`${year}${month}${date}`);

          await updateDoc(doc(db, uid, "tags"), newTags);
        });
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

export const getPeriodDiariesThunk = (
  uid: string,
  year: string,
  month: string
) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getPeriodStart());

      if (!window.navigator.onLine) {
        throw "Lost internet connection";
      }

      const periodData: Array<any> = [];

      await getDocs(
        query(collection(db, uid, year, month), orderBy("date", "desc"))
      ).then((docSnap) => {
        if (docSnap.empty) {
          return;
        } else {
          docSnap.forEach((doc) => {
            periodData.push(doc.data());
          });
        }
      });

      dispatch(getPeriodSuccess(periodData));
    } catch (error) {
      dispatch(getPeriodFail(error));
    }
  };
};

export const getTagsThunk = (uid: string) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getTagsStart());

      if (!window.navigator.onLine) {
        throw "Lost internet connection";
      }

      let tagData: any = {};
      await getDocs(collection(db, uid)).then((docSnap) => {
        if (docSnap.empty) {
          return;
        } else {
          docSnap.forEach((doc) => {
            const tagsObj = doc.data();
            const exist = Object.keys(tagsObj).filter(
              (tag) => tagsObj[tag].length !== 0
            );
            exist.forEach((tag) => {
              tagData[tag] = tagsObj[tag];
            });
          });
        }
      });

      dispatch(getTagsSuccess(tagData));
    } catch (error) {
      dispatch(getTagsFail(error));
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
        ...prev,
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
        ...prev,
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
      const periodData: Array<DiaryType> = [...prev.periodData];
      periodData.splice(
        periodData.findIndex(
          (diary) =>
            diary.date === `${action.year}${action.month}${action.date}`
        ),
        1
      );
      return {
        ...prev,
        data,
        periodData,
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
        ...prev,
        data: {},
        periodData: [],
        tags: [],
        loading: false,
        error: null,
      };
    }

    case PERIOD_INITIALIZATION: {
      return {
        ...prev,
        periodData: [],
        loading: false,
        error: null,
      };
    }

    case GET_PERIOD_START: {
      return { ...prev, loading: true, error: null };
    }

    case GET_PERIOD_SUCCESS: {
      return {
        ...prev,
        loading: false,
        error: null,
        periodData: [...prev.periodData, ...action.periodData],
      };
    }

    case GET_PERIOD_FAIL: {
      return {
        ...prev,
        loading: false,
        error: action.error,
        periodData: [],
      };
    }

    case GET_TAGS_START: {
      return { ...prev, loading: true, error: null };
    }

    case GET_TAGS_SUCCESS: {
      return {
        ...prev,
        loading: false,
        error: null,
        tags: action.tagData,
      };
    }

    case GET_TAGS_FAIL: {
      return {
        ...prev,
        loading: false,
        error: action.error,
        tags: [],
      };
    }

    case SET_PERIOD_PAGE: {
      return {
        ...prev,
        periodPage: action.periodPage,
      };
    }

    case SET_LATEST_TAB: {
      return {
        ...prev,
        latestTab: action.latestTab,
      };
    }

    default:
      return prev;
  }
};

const initialState = {
  data: {},
  periodData: [],
  loading: false,
  error: null,
  latestTab: 0,
  periodPage: 0,
  tags: [],
};

export default reducer;
