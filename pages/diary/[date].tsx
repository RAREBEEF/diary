import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDiariesThunk } from "../../redux/modules/setDiaries";
import { getHoliThunk } from "../../redux/modules/setHoli";
import { reduxStateType } from "../../redux/store";

const Diary = () => {
  const {
    loginData: {
      userData: { uid },
    },
    diariesData: { data: diaries },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryDate = router.query.date;
  const [diary, setDiary] = useState<any>({});
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);

  // 날짜에 해당하는 일기 가져오기
  useEffect(() => {
    // url(날짜) 체크
    if (
      !queryDate ||
      typeof queryDate !== "string" ||
      !/^[12][09][0-9][0-9][01][0-9][0-3][0-9]$/.test(queryDate)
    ) {
      setRedirectToHome(true);
      return;
    }

    const year = queryDate?.slice(0, 4);
    const month = queryDate?.slice(4, 6);
    const date = queryDate?.slice(-2);

    // diary 객체가 비어있을 경우 데이터 로드 및 공휴일 데이터 불러오기
    if (Object.keys(diaries).length === 0) {
      dispatch<any>(getDiariesThunk(uid, year, month));
      dispatch<any>(getHoliThunk(year));
      return;
    }

    // 해당하는 일기가 없을 경우 홈으로 이동
    // 일기가 있을 경우 출력
    if (
      !diaries[year] ||
      !diaries[year][month] ||
      !diaries[year][month][date]
    ) {
      setRedirectToHome(true);
      return;
    } else {
      setDiary(diaries[year][month][date]);
    }
  }, [diaries, dispatch, queryDate, redirectToHome, router, uid]);

  // 홈으로 이동
  // push를 이렇게 따로 분리하지 않을 경우 Abort fetching component for route: "/" 에러가 출력된다.
  useEffect(() => {
    redirectToHome && router.push("/");
  }, [redirectToHome, router]);

  return <section>{diary.title}</section>;
};

export default Diary;
