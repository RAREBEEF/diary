import Link from "next/link";

const NotFound = () => {
  return (
    <section className="page-container">
      <h1>
        <strong>404</strong> Not Found
      </h1>
      <p>존재하지 않는 페이지입니다.</p>
      <Link href="/">
        <a>홈으로 돌아가기</a>
      </Link>
      <style jsx>{`
        @import "../styles/var.scss";

        .page-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          row-gap: 20px;
          h1 {
            font: {
              size: 30px;
            }
          }
          a {
            text-decoration: $gray-color underline;
            font: {
              size: 16px;
            }
          }
        }
      `}</style>
    </section>
  );
};

export default NotFound;
