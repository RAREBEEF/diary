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

    if (formAction === "login") {
      setFormAction("signup");
    } else {
      setFormAction("login");
    }
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

    if (loading) {
      return;
    }

    if (formAction === "pwReset") {
      setLoading(true);

      sendPasswordResetEmail(auth, email)
        .then(() => {
          setAlert("재설정 메일이 발송되었습니다.");
        })
        .catch((error) => {
          setAlert(error.code);
        });
    } else if (formAction === "signup") {
      setLoading(true);

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
          setAlert(error.code);
        });
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
          setAlert(error.code);
        });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Dailiary</h1>
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
          <Button style={{ backgroundColor: "black", color: "white" }}>
            로그인
          </Button>
          <Button onClick={onFormActionChange}>회원가입하기</Button>
          <Button onClick={onFormActionToPwReset}>비밀번호 재설정</Button>
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
              placeholder="닉네임"
              autoComplete="nickname"
              value={displayName}
              onChange={onDisplayNameChange}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={onPwChange}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={pwCheck}
              onChange={onPwCheckChange}
            />
          </section>
          <Button style={{ backgroundColor: "black", color: "white" }}>
            회원가입
          </Button>
          <Button onClick={onFormActionChange}>기존 계정으로 로그인</Button>
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
          <Button style={{ backgroundColor: "black", color: "white" }}>
            재설정 메일 발송
          </Button>
          <Button onClick={onFormActionChange}>로그인하기</Button>
        </section>
      )}

      <style jsx>{`
        @import "../styles/var.scss";

        form {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          h1 {
            font: {
              size: 30px;
              weight: 700;
            }
          }

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
            gap: 5px;
            margin-bottom: 5vh;
            .input-wrapper {
              width: 30vw;
              min-width: 250px;
              display: flex;
              flex-direction: column;
              gap: 5px;
              margin-bottom: 10px;
              input {
                border: 1px solid $gray-color;
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
          }
        }
      `}</style>
    </form>
  );
};

export default LoginForm;
