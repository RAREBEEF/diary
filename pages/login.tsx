import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import LoginForm from "../components/LoginForm";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const Login = () => {
  const router = useRouter();
  const { isLoggedIn } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <section className="page-container">
      <LoginForm />
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </section>
  );
};

export default Login;
