import type { NextPage } from "next";
import Calendar from "../components/Calendar";
import DiaryList from "../components/DiaryList";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <section className="page-container">
      <Calendar />
      <DiaryList />
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
