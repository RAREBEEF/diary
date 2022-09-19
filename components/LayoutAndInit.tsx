import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { auth } from "../fb";
import { setCalendar } from "../redux/modules/setCalendar";
import { login } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";
import Button from "./Button";
import Loading from "./Loading";
import Nav from "./Nav";

interface Props {
  children: React.PropsWithChildren;
}

const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    loginData: { init: loginInit },
    calendarData: { init: calendarInit },
  } = useSelector((state: reduxStateType): reduxStateType => state);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installClicked, setInstallClicked] = useState<boolean>(false);

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

  // PWA 체크
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    if (standalone) {
      setIsStandalone(true);
    }
  }, []);

  useEffect(() => {
    const beforeinstallpomptListner = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", beforeinstallpomptListner);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeinstallpomptListner
      );
    };
  }, []);

  const onInstallClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setInstallClicked(true);

    if (!deferredPrompt) {
      router.push("/install");
      return;
    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;
  };

  return loginInit && calendarInit ? (
    <>
      {children}
      <Nav />
      {(deferredPrompt ||
        (!isStandalone && !installClicked && !deferredPrompt)) && (
        <Button
          onClick={onInstallClick}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
          }}
        >
          <div style={{ width: "20px", height: "20px", opacity: 0.6 }}>
            <Image
              src="/icons/download-solid.svg"
              width={10}
              height={10}
              layout="responsive"
              objectFit="contain"
              alt="앱 설치"
            />
          </div>
        </Button>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default Layout;
