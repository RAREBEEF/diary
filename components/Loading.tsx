import Image from "next/image";

interface Props {
  isShow: boolean;
}

const Loading: React.FC<Props> = ({ isShow = false }) => {
  return (
    <div className={isShow ? "show" : ""}>
      <Image src="/vercel.svg" width="200" height="70" alt="Loading..." />
      <p>로딩 중</p>
      <style jsx>{`
        div {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          pointer-events: none;
          opacity: 0;
          backdrop-filter: none;
          transition: all 0.3s;

          &.show {
            transition: all 0.1s;
            pointer-events: all;
            opacity: 1;
            backdrop-filter: blur(2.5px);
          }

          p {
            font: {
              size: 20px;
              weight: 700;
            }
            &::after {
              position: absolute;
              content: "";
              animation: dots 1s infinite;
              @keyframes dots {
                0% {
                  content: "";
                }
                25% {
                  content: ".";
                }
                50% {
                  content: "..";
                }
                75% {
                  content: "...";
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
