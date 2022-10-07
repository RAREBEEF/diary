import Image from "next/image";
import Link from "next/link";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import { setLatestTab } from "../redux/modules/setDiaries";
import { reduxStateType } from "../redux/store";

const Nav = () => {
  // const dispatch = useDispatch();
  const {
    loginData: { isLoggedIn },
    calendarData: {
      today: { year, month, date },
    },
  } = useSelector((state: reduxStateType): reduxStateType => state);

  // /**
  //  * 컴포넌트 내 아무 곳이나 클릭 시 홈화면 달력 탭을 최근 탭으로 저장*/
  // const onContainerClick = () => {
  //   dispatch(setLatestTab(0));
  // };

  return (
    <nav /* onClick={onContainerClick} */>
      <Link href="/">
        <a className="hover-brighter">
          <Image
            src="/icons/home-solid.svg"
            width={20}
            height={20}
            alt="Home"
          />
          <h4>Home</h4>
        </a>
      </Link>
      <Link
        href={{
          pathname: `/write/${year}${month}${date}`,
        }}
      >
        <a className="hover-brighter">
          <Image
            src="/icons/write-solid.svg"
            width={20}
            height={20}
            alt="Today"
          />
          <h4>Today</h4>
        </a>
      </Link>
      <Link href="/tags">
        <a className="hover-brighter">
          <Image
            src="/icons/hash-solid.svg"
            width={20}
            height={20}
            alt="Tags"
          />
          <h4>Tags</h4>
        </a>
      </Link>
      <Link href={isLoggedIn ? "/profile" : "/login"}>
        {isLoggedIn ? (
          <a className="hover-brighter">
            <Image
              src="/icons/profile-solid.svg"
              width={20}
              height={20}
              alt="Profile"
            />
            <h4>Profile</h4>
          </a>
        ) : (
          <a className="hover-brighter">
            <Image
              src="/icons/login-solid.svg"
              width={20}
              height={20}
              alt="Login"
            />
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
          }
        }

        @media all and (max-height: 420px) {
          nav {
            height: 30px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
