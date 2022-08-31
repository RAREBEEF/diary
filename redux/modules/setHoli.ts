import React from "react";
import * as xml2js from "xml2js";

export interface HoliDataStateType {
  data: any;
  loading: boolean;
  error: any;
}

export const GET_HOLI_START = "GET_HOLI_START";
export const GET_HOLI_SUCCESS = "GET_HOLI_SUCCESS";
export const GET_HOLI_FAIL = "GET_HOLI_FAIL";

const getHoliStart = () => {
  return {
    type: GET_HOLI_START,
  };
};

const getHoliSuccess = (data: any, year: string) => {
  return {
    type: GET_HOLI_SUCCESS,
    data,
    year,
  };
};

const getHoliFail = (error: any, year: string) => {
  return {
    type: GET_HOLI_FAIL,
    error,
    year,
  };
};

export const getHoliThunk = (year: string) => {
  return async (dispatch: React.Dispatch<any>) => {
    try {
      dispatch(getHoliStart());

      if (!window.navigator.onLine) {
        throw "Lost internet connection";
      }

      let parsedData;

      await fetch(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&numOfRows=100&ServiceKey=${process.env.NEXT_PUBLIC_HOLIDAY_API_KEY}`
      )
        .then((response) => response.text())
        .then((data) => {
          let parseString = xml2js.parseString;

          parseString(data, function (err: any, result: any) {
            parsedData = result.response.body[0].items[0].item.map((el: any) =>
              el.locdate[0].slice(4)
            );
          });
        });

      dispatch(getHoliSuccess(parsedData, year));
    } catch (error) {
      window.alert(
        `공휴일 데이터를 불러오는데 실패하였습니다.\n통신 상태가 불안정하거나 범위를 넘어선 요청입니다.`
      );
      dispatch(getHoliFail(error, year));
    }
  };
};

const reducer = (prev = initialState, action: any) => {
  switch (action.type) {
    case GET_HOLI_START: {
      return { ...prev, loading: true, error: null };
    }
    case GET_HOLI_SUCCESS: {
      const data: any = { ...prev.data };

      data[action.year] = action.data;

      return {
        loading: false,
        error: null,
        data,
      };
    }
    case GET_HOLI_FAIL: {
      const data: any = { ...prev.data };
      data[action.year] = [];

      return {
        loading: false,
        error: action.error,
        data,
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
