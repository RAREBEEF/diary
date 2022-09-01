import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const Nav = () => {
  // const router = useRouter();
  const { isLoggedIn } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );
  const today = new Date();

  // useEffect(() => {
  //   const path = router.pathname;
  //   console.log(path);
  //   console.log(/^\/profile|^\/write|\/diary/gi.test(path));
  //   if (isLoggedIn) {
  //     return;
  //   }
  // }, [isLoggedIn, router.pathname]);

  return (
    <nav>
      <Link href="/">
        <a>
          <Image src="/home-solid.svg" width={20} height={20} alt="Nav" />
          <h4>Home</h4>
        </a>
      </Link>
      <Link
        href={{
          pathname: `/write/${today.getFullYear()}${
            today.getMonth() < 9
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1
          }${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`,
        }}
      >
        <a>
          <Image src="/add-solid.svg" width={20} height={20} alt="Nav" />
          <h4>Today</h4>
        </a>
      </Link>
      <Link href={isLoggedIn ? "/profile" : "/login"}>
        {isLoggedIn ? (
          <a>
            <Image src="/profile-solid.svg" width={20} height={20} alt="Nav" />
            <h4>Profile</h4>
          </a>
        ) : (
          <a>
            <Image src="/login-solid.svg" width={20} height={20} alt="Nav" />
            <h4>Login</h4>
          </a>
        )}
      </Link>

      <style jsx>{`
        @import "../styles/var.scss";

        nav {
          color: #828282;
          position: fixed;
          bottom: 0;
          width: 100%;
          min-width: $min-width;
          height: $nav-height;
          display: flex;
          box-sizing: border-box;
          background-color: white;
          box-shadow: 0px -1px 5px $gray-color;

          a {
            transition: filter 0.3s;
            width: 0;
            flex-grow: 1;
            text-align: center;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: {
              top: 7px;
              bottom: 20px;
            }

            h4 {
              height: 12px;
              line-height: 12px;
              margin: 0;
              padding: 0;
              font: {
                size: 13px;
                weight: 500;
              }
            }

            &:hover {
              filter: brightness(1.5);
            }
          }
        }

        @media all and (max-height: 420px) {
          nav {
            height: 30px;
          }
        }
        @media (prefers-color-scheme: dark) {
          nav {
            background-color: black;
            box-shadow: 0px -1px 5px #333333;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
