import type { NextPage } from "next";
import Calendar from "../components/Calendar";
import PeriodList from "../components/PeriodList";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <section className="page-container">
      <Calendar />
      <PeriodList />
      <Footer />
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
