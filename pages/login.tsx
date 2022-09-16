import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import Seo from "../components/Seo";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const Login = () => {
  const router = useRouter();
  const { isLoggedIn } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );

  useEffect(() => {
    if (router.query.reauth === "true") {
      return;
    } else if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <section className="page-container">
      <Seo title="Dailiary | Login" />
      <div className="img-wrapper">
        <Image
          src="/logos/logo.svg"
          width="80"
          height="20"
          layout="responsive"
          objectFit="contain"
          alt="Dailiary"
        />
      </div>
      <LoginForm reauth={router.query.reauth === "true"} />
      <Footer />
      <style jsx>{`
        .page-container {
          padding: {
            top: 30px;
            bottom: 80px;
          }
          display: flex;
          .img-wrapper {
            text-align: center;
          }
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </section>
  );
};

export default Login;
