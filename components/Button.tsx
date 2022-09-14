import classNames from "classnames";
import { CSSProperties } from "react";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  children: JSX.Element | string | number;
  type?: "submit" | "button" | "reset" | undefined;
}

const Button: React.FC<Props> = ({ onClick, style, children, type }) => {
  return (
    <button
      onClick={onClick}
      style={style}
      type={type}
      className={classNames("hover-brighter", "hover-bigger")}
    >
      {children}

      <style jsx>{`
        @import "../styles/var.scss";

        button {
          cursor: pointer;
          border: 1.5px solid $gray-color;
          border-radius: 5px;
          padding: 5px;
          filter: none;
          font: {
            size: 14px;
          }
        }
      `}</style>
    </button>
  );
};

export default Button;
