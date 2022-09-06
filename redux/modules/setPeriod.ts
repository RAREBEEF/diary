import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../fb";


export const GET_PERIOD_START = "GET_PERIOD_START";
export const GET_PERIOD_SUCCESS = "GET_PERIOD_SUCCESS";
export const GET_PERIOD_FAIL = "GET_PERIOD_FAIL";

const getPeriodStart = () => {
  return {
    type: GET_PERIOD_START,
  };
};

const getPeriodSuccess = (data: Array<any>) => {
  return {
    type: GET_PERIOD_SUCCESS,
    data,
  };
};

const getPeriodFail = (error: any) => {
  return {
    type: GET_PERIOD_FAIL,
    error,
  };
};

export const getPeriodDiariesThunk = (
  uid: string,
  periodArr: Array<Array<any>>
) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getPeriodStart());

      if (!window.navigator.onLine) {
        throw "Lost internet connection";
      }

      const data: Array<any> = [];

      periodArr.forEach(async (period) => {
        await getDocs(
          query(
            collection(db, uid, period[0], period[1]),
            orderBy("date", "desc")
          )
        ).then((docSnap) => {
          docSnap.forEach((doc) => {
            data.push(doc.data());
          });
        });
      });

      dispatch(getPeriodSuccess(data));
    } catch (error) {
      window.alert(
        `일기 데이터를 불러오는데 실패하였습니다.\n통신 상태를 확인해 주세요.`
      );
      dispatch(getPeriodFail(error));
    }
  };
};

const reducer = (prev = initialState, action: any) => {
  switch (action.type) {
    case GET_PERIOD_START: {
      return { loading: true, error: null, data: [] };
    }

    case GET_PERIOD_SUCCESS: {
      return {
        loading: false,
        error: null,
        data: action.data,
      };
    }

    case GET_PERIOD_FAIL: {
      return {
        loading: false,
        error: action.error,
        data: [],
      };
    }

    default:
      return prev;
  }
};

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default reducer;
