import Calendar from "../components/Calendar";
import PeriodList from "../components/PeriodList";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { reduxStateType } from "../redux/store";
import { DiariesDataStateType } from "../redux/modules/setDiaries";
import { NextPage } from "next";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { loading, latestTab } = useSelector(
    (state: reduxStateType): DiariesDataStateType => state.diariesData
  );

  // 마지막 탭이 기간별 일기 모아보기 탭일 경우 페이지 로드 시 해당 탭으로 스크롤 이동
  useEffect(() => {
    if (window.scrollY === 0 && latestTab === 1) {
      window.scrollTo({ top: window.innerHeight + 50 });
    }
  }, [latestTab]);

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
            min-height: 100vh;
            position: sticky;
            top: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;
