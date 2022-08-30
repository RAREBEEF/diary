import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { reduxStateType } from "../../redux/store";

const Diary = () => {
  const {
    userData: { uid },
  } = useSelector((state: reduxStateType) => state.loginData);
  const router = useRouter();
  const date = router.query.date;
  return (
    <section>
      {date}/{uid}
    </section>
  );
};

export default Diary;
