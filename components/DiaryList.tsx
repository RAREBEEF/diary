import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../fb";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const DiaryList = () => {
  const {
    userData: { uid },
  } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );

  const getDiary = useCallback(async () => {
    console.log("called");
    const querySnapshot = await getDocs(collection(db, uid));
    console.log(querySnapshot);

    querySnapshot.forEach((doc) => {
      console.log(doc);
    });
  }, [uid]);

  useEffect(() => {
    console.log("run");
    getDiary();
  }, [getDiary]);

  return (
    <section className="container">
      <div className="inner-wrapper">
        <hgroup>
          <h2>작성한 일기들</h2>
        </hgroup>
      </div>
      <style jsx>{`
        @import "./styles/var.scss";

        section {
          background-color: white;
          box-shadow: 0px -1px 5px #333333;

          .inner-wrapper {
            max-width: 1000px;
            margin: auto;
            padding: {
              left: 50px;
              right: 50px;
            }

            h2 {
              width: fit-content;
              width: 100%;
              max-width: 1000px;
              margin: auto;
              padding: {
                top: 50px;
              }
              width: fit-content;
              color: $gray-color;
              margin-top: 20px;
              font: {
                size: 30px;
                weight: 700;
              }
            }
          }
        }
      `}</style>
    </section>
  );
};

export default DiaryList;
