import Image from "next/image";
import { CSSProperties } from "react";

interface Props {
  text: string;
  imgSrc?: string;
  imgWidth?: number;
  imgHeight?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

const Button: React.FC<Props> = ({
  text,
  imgSrc,
  onClick,
  imgWidth,
  imgHeight,
  style,
}) => {
  return (
    <button onClick={onClick} style={style}>
      {imgSrc ? (
        <Image src={imgSrc} alt={text} width={imgWidth} height={imgHeight} />
      ) : (
        text
      )}
      <style jsx>{`
        button {
          cursor: pointer;
          transition: filter 0.3s;
          &:hover {
            filter: brightness(1.5);
          }
        }
      `}</style>
    </button>
  );
};

export default Button;
