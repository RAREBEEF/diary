import Head from "next/head";

interface Props {
  title?: string;
}

const Seo: React.FC<Props> = ({ title = "일기장" }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="author" content="RAREBEEF" />
      <meta
        name="description"
        content="오늘의 기분, 날씨, 사진 등 매일의 하루를 기록할 수 있는 일기장입니다. 로그인 후 첫 일기를 작성해 보세요."
      />
    </Head>
  );
};

export default Seo;
