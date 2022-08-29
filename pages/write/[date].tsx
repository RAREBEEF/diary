import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import useInput from "../../hooks/useInput";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../fb";
import { useSelector } from "react-redux";
import { reduxStateType } from "../../redux/store";

const Write = () => {
  const {
    userData: { uid: uid },
  } = useSelector((state: reduxStateType) => state.loginData);
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
      console.log("returned", uid, year, month, date);
      return;
    }

    try {
      await setDoc(doc(db, uid, year, month, date), {
        title,
        content,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
