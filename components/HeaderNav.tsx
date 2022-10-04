import Link from "next/link";
import { Children, ReactNode } from "react";

interface Props {
  backTo: string;
  backToText: string;
  title: string;
  subTitle: string;
  children?: ReactNode;
}

const HeaderNav: React.FC<Props> = ({
  backTo,
  backToText,
  title,
  subTitle,
  children,
}) => {
  return (
    <nav>
      <Link href={backTo}>
        <a>
          {"< "}
          {backToText}
        </a>
      </Link>
      {children}
      <hgroup>
        <h2>{subTitle}</h2>
        <h1>{title}</h1>
      </hgroup>

      <style jsx>{`
        @import "../styles/var.scss";

        nav {
          width: 100%;
          max-width: 1000px;
          margin: auto;
          word-break: keep-all;
          padding: {
            top: 50px;
            bottom: 30px;
          }

          hgroup {
            width: fit-content;
            color: $gray-color;
            margin-top: 20px;

            h1 {
              width: fit-content;
              font: {
                size: 30px;
                weight: 700;
              }
            }

            h2 {
              margin: {
                left: 2.5px;
              }
            }
          }
        }
      `}</style>
    </nav>
  );
};

export default HeaderNav;
