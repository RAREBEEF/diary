import { deleteUser, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { auth } from "../fb";
import { sendPasswordResetEmail } from "firebase/auth";
import useInput from "../hooks/useInput";
import { diaryInitialization } from "../redux/modules/setDiaries";
import { login, loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";
import Seo from "../components/Seo";
import HeaderNav from "../components/HeaderNav";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    value: newDisplayName,
    setValue: setNewDisplayName,
    onChange: onNewDisplayNameChange,
  } = useInput("");
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
    const ok = window.confirm(`로그아웃 하시겠습니까?`);

    if (ok)
      auth.signOut().then(() => {
        dispatch(diaryInitialization());

        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: false,
            userData: { user: null, uid: "", displayName: "" },
          })
        );
      });
  };

  const onDisplayNameChangeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!auth.currentUser) {
      return;
    }

    if (newDisplayName.length === 0) {
      window.alert(`이름을 입력해 주세요.`);
    } else if (newDisplayName.length < 2 || newDisplayName.length > 20) {
      window.alert(`이름은 2~20 글자 이내여야 합니다.`);
    }

    updateProfile(auth.currentUser, {
      displayName: newDisplayName,
    })
      .then(() => {
        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: true,
            userData: { uid, displayName: newDisplayName },
          })
        );
        setNewDisplayName("");
        window.alert(`이름이 변경되었습니다.`);
      })
      .catch((error) => {
        window.alert(
          `이름 변경에 실패하였습니다.\n잠시 후 다시 시도해 주세요.`
        );
      });
  };

  // 비밀번호 변경
  const onPwResetClick = () => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return;
    }
    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        window.alert(`재설정 메일이 발송되었습니다.`);
      })
      .catch((error) => {
        // 재인증 필요
        if (error.code === "auth/requires-recent-login") {
          reAuth();
        } else {
          window.alert(
            `메일 발송에 실패하였습니다.\n잠시 후 다시 시도해 주세요.`
          );
        }
      });
  };

  // 계정 삭제
  const onDeleteAccountClick = () => {
    if (!auth.currentUser) {
      return;
    }
    const ok = window.confirm(`계정을 삭제 하시겠습니까?`);

    if (ok) {
      const sure = window.confirm(
        `삭제된 데이터는 복구가 불가능 합니다.\n계속 진행 하시겠습니까?`
      );
      if (sure) {
        deleteUser(auth.currentUser)
          .then(() => {
            dispatch(diaryInitialization());
            dispatch(
              login.actions.setLogIn({
                init: true,
                isLoggedIn: false,
                userData: { user: null, uid: "", displayName: "" },
              })
            );
          })
          .catch((error) => {
            // 재인증 필요
            if (error.code === "auth/requires-recent-login") {
              reAuth();
            } else {
              window.alert(
                `계정 삭제에 실패하였습니다.\n잠시 후 다시 시도해 주세요`
              );
            }
          });
      }
    }
  };

  // 재인증 절차
  const reAuth = () => {
    const ok = window.confirm(
      `마지막 로그인이 너무 오래되어 재로그인이 필요합니다.`
    );
    if (ok)
      router.push(
        {
          pathname: `/login`,
          query: {
            reauth: true,
          },
        },
        "/login"
      );
  };

  return (
    <section className="page-container">
      <Seo title="일기장 | 프로필" />
      <div>
        <HeaderNav title="프로필 설정" subTitle={displayName} />

        <section className="contents">
          <div className="displayName">
            <h3>이름</h3>
            <div className="inner-wrapper">
              <input
                type="text"
                placeholder={displayName}
                size={15}
                value={newDisplayName}
                onChange={onNewDisplayNameChange}
              />
              <Button
                style={{ height: "auto" }}
                onClick={onDisplayNameChangeClick}
              >
                이름 변경
              </Button>
            </div>
          </div>

          <div className="password">
            <h3>비밀번호</h3>
            <div className="inner-wrapper">
              <Button onClick={onPwResetClick}>재설정 메일 발송</Button>
            </div>
          </div>

          <div className="account">
            <h3>계정 설정</h3>
            <div className="inner-wrapper">
              <Button onClick={onLogoutClick}>로그아웃</Button>
              <Button
                onClick={onDeleteAccountClick}
                style={{ color: "firebrick", borderColor: "firebrick" }}
              >
                탈퇴
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <style jsx global>{`
        @import "../styles/var.scss";

        .page-container {
          & > div {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: {
              left: 50px;
              right: 50px;
            }
          }

          nav {
            padding-bottom: 50px;
          }

          .contents {
            width: 100%;
            margin: auto;
          }

          .contents {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 40px;
            width: 80%;
            max-width: 800px;
            padding-bottom: 50px;

            .displayName,
            .password,
            .account {
              display: flex;
              flex-direction: column;
              gap: 20px;
              border-bottom: 0.5px solid $gray-color;
              padding-bottom: 40px;

              h3 {
                color: $gray-color;
                font: {
                  size: 20px;
                }
              }

              .inner-wrapper {
                width: 100%;
                justify-content: flex-end;
                display: flex;
                flex-wrap: wrap;

                gap: 10px;
                input {
                  border: 1.5px solid $gray-color;
                  padding: 5px 10px;
                  border-radius: 5px;
                  font: {
                    size: 16px;
                  }
                }
              }
            }
          }
        }

        @media all and (max-width: 500px) {
          .page-container {
            & > div {
              padding: {
                left: 20px;
                right: 20px;
              }
            }
          }
        }
      `}</style>
    </section>
  );
};

export default Profile;
