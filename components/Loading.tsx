import classNames from "classnames";
import Image from "next/image";

interface Props {
  isShow?: boolean;
  text?: string;
}

const Loading: React.FC<Props> = ({ isShow = true, text = "로딩 중" }) => {
  return (
    <div className={classNames(isShow ? "show" : "", "no-drag")}>
      <Image src="/logos/logo.svg" width="200" height="150" alt="Loading..." />
      <p>{text}</p>
      <style jsx>{`
        div {
          background-color: rgba(255, 255, 255, 0.3);
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
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
