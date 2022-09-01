import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import { auth } from "../fb";
import { diaryInitialization } from "../redux/modules/setDiaries";
import { login, loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isLoggedIn,
    userData: { uid, displayName },
  } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const onLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    auth.signOut();

    dispatch(diaryInitialization());

    dispatch(
      login.actions.setLogIn({
        init: true,
        isLoggedIn: false,
        userData: { user: null, uid: "", displayName: "" },
      })
    );
  };

  return (
    <section className="page-container">
      {uid}
      {displayName}
      <Button onClick={onLogoutClick}>로그아웃</Button>
    </section>
  );
};

export default Profile;
