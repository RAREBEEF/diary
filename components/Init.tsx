import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../fb";
import { login } from "../redux/modules/setLogin";

const Init = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: true,
            userData: { uid: user.uid, displayName: user.displayName },
          })
        );
      } else {
        dispatch(
          login.actions.setLogIn({
            init: true,
            isLoggedIn: false,
            userData: { uid: "", displayName: "" },
          })
        );
      }
    });
  }, [dispatch]);

  return <></>;
};

export default Init;
