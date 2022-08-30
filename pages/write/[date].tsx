import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import useInput from "../../hooks/useInput";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../fb";
import { useSelector } from "react-redux";
import { reduxStateType } from "../../redux/store";
import { useDispatch } from "react-redux";
import { getDiariesThunk } from "../../redux/modules/setDiaries";
import { getHoliThunk } from "../../redux/modules/setHoli";

const Write = () => {
  const dispatch = useDispatch();
  const {
    loginData: {
      userData: { uid },
    },
    diariesData: { data: diaries },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const {
    value: title,
    setValue: setTitle,
    onChange: onTitleChange,
  } = useInput("");
  const {
    value: content,
    setValue: setContent,
    onChange: onContentChange,
  } = useInput("");
  const router = useRouter();
  const queryDate = router.query.date;
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [redirectToDiary, setRedirectToDiary] = useState<boolean>(false);

  // 날짜에 해당하는 일기가 이미 있는지 체크
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

    // 해당하는 일기가 없을 경우 계속 작성
    // 이미 일기가 있을 경우 홈으로 이동
    if (
      !diaries[year] ||
      !diaries[year][month] ||
      !diaries[year][month][date]
    ) {
      return;
    } else {
      setRedirectToDiary(true);
    }
  }, [diaries, dispatch, queryDate, redirectToHome, router, uid]);

  // 일기 등록
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const year = queryDate?.slice(0, 4);
    const month = queryDate?.slice(4, 6);
    const date = queryDate?.slice(-2);

    if (
      !uid ||
      typeof uid !== "string" ||
      !year ||
      typeof year !== "string" ||
      !month ||
      typeof month !== "string" ||
      !date ||
      typeof date !== "string"
    ) {
      return;
    }

    try {
      await setDoc(doc(db, uid, year, month, date), {
        title,
        content,
      });
      dispatch<any>(getDiariesThunk(uid, year, month));
      setRedirectToHome(true);
    } catch (error) {
      console.log(error);
    }
  };

  // 리디렉션
  // push를 이렇게 따로 분리하지 않을 경우 Abort fetching component for route: "/" 에러가 출력된다.
  useEffect(() => {
    redirectToHome && router.push("/");
    redirectToDiary && router.push(`/diary/${queryDate}`);
  }, [queryDate, redirectToDiary, redirectToHome, router]);

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={title} onChange={onTitleChange} />
      <textarea value={content} onChange={onContentChange} />
      <Button text="작성 완료" />

      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          input,
          textarea {
            border: 1px solid gray;
          }
        }
      `}</style>
    </form>
  );
};

export default Write;
