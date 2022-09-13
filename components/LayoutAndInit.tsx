import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { auth } from "../fb";
import { setCalendar } from "../redux/modules/setCalendar";
import { login } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";
import Loading from "./Loading";
import Nav from "./Nav";

interface Props {
  children: React.PropsWithChildren;
}

const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const {
    loginData: { init: loginInit },
    calendarData: { init: calendarInit },
  } = useSelector((state: reduxStateType): reduxStateType => state);

  // 현재 연도와 월을 달력 초기값으로 할당 (최초 1회 실행)
  useEffect(() => {
    if (!calendarInit) {
      const now = new Date();

      dispatch(
        setCalendar.actions.setToday({
          year: now.getFullYear().toString(),
          month:
            now.getMonth() < 9
              ? "0" + (now.getMonth() + 1)
              : (now.getMonth() + 1).toString(),
          date: now.getDate().toString(),
        })
      );

      dispatch(
        setCalendar.actions.setCurDate({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        })
      );

      dispatch(setCalendar.actions.setInit(true));
    }
  }, [dispatch, calendarInit]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: true,
            userData: { uid: user.uid, displayName: user.displayName },
          })
        );
      } else {
        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: false,
            userData: { uid: "", displayName: "" },
          })
        );
      }
    });
  }, [dispatch]);

  return loginInit && calendarInit ? (
    <>
      {children}
      <Nav />
    </>
  ) : (
    <Loading />
  );
};

export default Layout;
