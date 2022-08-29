import { useRouter } from "next/router";

const Diary = () => {
  const router = useRouter();
  const uid = router.query.id;
  const date = router.query.date;
  return (
    <section>
      {date}/{uid}
    </section>
  );
};

export default Diary;
