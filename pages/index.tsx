import Calendar from "../components/Calendar";
import PeriodList from "../components/PeriodList";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { reduxStateType } from "../redux/store";
import { DiariesDataStateType } from "../redux/modules/setDiaries";
import { NextPage } from "next";

const Home: NextPage = () => {
  const { loading } = useSelector(
    (state: reduxStateType): DiariesDataStateType => state.diariesData
  );

  return (
    <section className="page-container">
      <Calendar />
      <PeriodList />
      <Footer />
      <Loading isShow={loading} />
      <style jsx global>{`
        @import "../styles/var.scss";

        .page-container {
          .container {
            height: 100vh;
            position: sticky;
            top: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;
