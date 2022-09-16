import React, { CSSProperties, useState } from "react";
import Button from "./Button";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import useInput from "../hooks/useInput";
import { useDispatch } from "react-redux";
import { login } from "../redux/modules/setLogin";
import { auth } from "../fb";
import { useRouter } from "next/router";
import Loading from "./Loading";

type formActionType = "login" | "signup" | "pwReset";
interface Props {
  reauth: boolean;
}
const LoginForm: React.FC<Props> = ({ reauth }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { value: email, onChange: onEmailChange } = useInput("");
  const { value: displayName, onChange: onDisplayNameChange } = useInput("");
  const { value: pw, setValue: setPw, onChange: onPwChange } = useInput("");
  const {
    value: pwCheck,
    setValue: setPwCheck,
    onChange: onPwCheckChange,
  } = useInput("");
  const { value: alert, setValue: setAlert } = useInput("");
  const [formAction, setFormAction] = useState<formActionType>("login");
  const [loading, setLoading] = useState<boolean>(false);

  // 로그인 / 회원가입 전환
  const onFormActionChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPw("");
    setPwCheck("");
    setAlert("");

    if (formAction === "login") setFormAction("signup");
    else setFormAction("login");
  };

  // 비밀번호 재설정 전환
  const onFormActionToPwReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPw("");
    setPwCheck("");
    setAlert("");
    setFormAction("pwReset");
  };

  // 전송
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (email.length === 0) {
      setAlert(`이메일을 입력해 주세요.`);
      return;
    } else if (pw.length === 0) {
      setAlert(`비밀번호 입력해 주세요.`);
      return;
    }

    // 비밀번호 재설정
    if (formAction === "pwReset") {
      setLoading(true);

      sendPasswordResetEmail(auth, email)
        .then(() => {
          setAlert("메일이 발송되었습니다.");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/user-not-found":
              setAlert("잘못된 이메일 형식입니다.");
              break;
            case "auth/invalid-email":
              setAlert("존재하지 않는 사용자입니다.");
              break;
            default:
              setAlert(error.code);
          }
        });

      // 회원가입
    } else if (formAction === "signup") {
      setLoading(true);

      if (displayName.length === 0) setAlert(`이름을 입력해 주세요.`);
      else if (displayName.length < 2 || displayName.length > 20)
        setAlert(`이름은 2~20 글자 이내여야 합니다.`);
      else if (pw.length < 6) setAlert(`비밀번호는 6자 이상이어야 합니다.`);
      else if (pwCheck.length === 0) setAlert(`비밀번호 확인을 입력해 주세요.`);
      else if (pw !== pwCheck) setAlert(`비밀번호 확인이 일치하지 않습니다.`);
      else if (pw !== pwCheck) setAlert(`비밀번호 확인이 일치하지 않습니다.`);
      else
        createUserWithEmailAndPassword(auth, email, pw)
          .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
              displayName,
            }).then(() => {
              dispatch(
                login.actions.setLogIn({
                  init: true,
                  isLoggedIn: true,
                  userData: {
                    uid: user.uid,
                    displayName: user.displayName,
                  },
                })
              );
            });
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/user-not-found":
                setAlert("잘못된 이메일 형식입니다.");
                break;
              default:
                setAlert(error.code);
            }
          });

      // 로그인
    } else if (formAction === "login") {
      setLoading(true);

      signInWithEmailAndPassword(auth, email, pw)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(
            login.actions.setLogIn({
              init: true,
              isLoggedIn: true,
              userData: { uid: user.uid, displayName: user.displayName },
            })
          );
          if (reauth) {
            router.push("/profile");
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/user-not-found":
              setAlert("잘못된 이메일 형식입니다.");
              break;
            case "auth/invalid-email" || "auth/wrong-password":
              setAlert("이메일 혹은 비밀번호가 일치하지 않습니다.");
              break;
            default:
              setAlert(error.code);
          }
        });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <p className="alert">{alert}</p>

      {formAction === "login" && (
        <section className="login">
          <section className="input-wrapper">
            <input
              type="text"
              placeholder="이메일"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
            />
            <input
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              value={pw}
              onChange={onPwChange}
            />
          </section>
          <div className="btn-wrapper">
            <Button
              style={{
                backgroundColor: "#6d6a66",
                color: "white",
                fontWeight: "700",
              }}
            >
              로그인
            </Button>
            <Button onClick={onFormActionChange}>회원가입하기</Button>
            <Button onClick={onFormActionToPwReset}>비밀번호 재설정</Button>
          </div>
        </section>
      )}

      {formAction === "signup" && (
        <section className="sign-up">
          <section className="input-wrapper">
            <input
              type="text"
              placeholder="이메일"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
            />
            <input
              type="text"
              placeholder="이름"
              autoComplete="nickname"
              value={displayName}
              onChange={onDisplayNameChange}
              maxLength={20}
              style={{
                borderColor:
                  displayName.length >= 2 && displayName.length <= 20
                    ? "inherit"
                    : "firebrick",
              }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={onPwChange}
              style={{
                borderColor: pw.length >= 6 ? "inherit" : "firebrick",
              }}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={pwCheck}
              onChange={onPwCheckChange}
              style={{
                borderColor:
                  pw === pwCheck && pwCheck !== "" ? "inherit" : "firebrick",
              }}
            />
          </section>
          <div className="btn-wrapper">
            <Button
              style={{
                backgroundColor: "#6d6a66",
                color: "white",
                fontWeight: "700",
              }}
            >
              회원가입
            </Button>
            <Button onClick={onFormActionChange}>기존 계정으로 로그인</Button>
          </div>
        </section>
      )}

      {formAction === "pwReset" && (
        <section className="pw-reset">
          <section className="input-wrapper">
            <input
              type="email"
              placeholder="이메일"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
            />
          </section>
          <div className="btn-wrapper">
            <Button
              style={{
                backgroundColor: "#6d6a66",
                color: "white",
                fontWeight: "700",
              }}
            >
              재설정 메일 발송
            </Button>
            <Button onClick={onFormActionChange}>로그인하기</Button>
          </div>
        </section>
      )}

      <Loading isShow={loading} />

      <style jsx>{`
        @import "../styles/var.scss";

        form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .alert {
            height: 13px;
            line-height: 13px;
            margin: {
              top: 10px;
              bottom: 10px;
            }
            font: {
              size: 13px;
            }
          }

          .login,
          .sign-up,
          .pw-reset {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 5vh;

            .input-wrapper {
              width: 30vw;
              min-width: 250px;
              display: flex;
              flex-direction: column;
              gap: 5px;
              margin-bottom: 10px;
              input {
                border: 1.5px solid $gray-color;
                border-radius: 5px;
                padding: {
                  left: 5px;
                  right: 5px;
                }
                font: {
                  size: 16px;
                }
              }
            }
            .btn-wrapper {
              width: 30vw;
              min-width: 250px;
              display: flex;
              gap: 10px;
              flex-wrap: wrap;
              justify-content: center;
            }
          }
        }
      `}</style>
    </form>
  );
};

export default LoginForm;
