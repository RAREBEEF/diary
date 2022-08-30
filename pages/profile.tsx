import { useSelector } from "react-redux";
import { loginDataStateType } from "../redux/modules/setLogin";
import { reduxStateType } from "../redux/store";

const Profile = () => {
  const {
    init,
    isLoggedIn,
    userData: { uid, displayName },
  } = useSelector(
    (state: reduxStateType): loginDataStateType => state.loginData
  );
  console.log(init, isLoggedIn, uid, displayName);
  return (
    <section className="page-container">
      {init}
      {isLoggedIn}
      {uid}
      {displayName}
    </section>
  );
};

export default Profile;
