// 공휴일 데이터는 불러오는데 오랜 시간이 소요되는 경우가 있어서 로딩을 별도로 분리
interface Props {
  isShow: boolean;
}

const HoliLoading: React.FC<Props> = ({ isShow }) => {
  return (
    <div className={isShow ? "show" : ""}>
      공휴일 정보를 불러오는 중
      <style jsx>{`
        @import "../styles/var.scss";

        div {
          background-color: $gray-color;
          width: 250px;
          text-align: center;
          margin: auto;
          padding: 5px 10px;
          padding-right: 30px;
          border-radius: 15px;
          color: white;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s 1s;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 12vh;
          font: {
            size: 16px;
            weight: 700;
          }

          &.show {
            transition: opacity 0.1s 0s;
            opacity: 0.5;
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
      `}</style>
    </div>
  );
};

export default HoliLoading;
