import type { NextPage } from "next";
import Calendar from "../components/Calendar";

const Home: NextPage = () => {
  return (
    <section className="page-container">
      <Calendar />
    </section>
  );
};

export default Home;
