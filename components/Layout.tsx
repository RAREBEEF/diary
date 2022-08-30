import { useSelector } from "react-redux";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";
import Loading from "./Loading";
import Nav from "./Nav";

interface Props {
  children: React.PropsWithChildren;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { init: loginInit } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );
  return loginInit ? (
    <>
      {children}
      <Nav />
    </>
  ) : (
    <Loading isShow={!loginInit} />
  );
};

export default Layout;
