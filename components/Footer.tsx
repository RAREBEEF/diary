import Link from "next/link";
import { memo } from "react";

const Footer = () => {
  return (
    <footer className="container">
      <section className="copyright">
        &copy; {new Date().getFullYear()}. RAREBEEF All Rights Reserved.
      </section>

      <section className="contact">
        <div>
          <span>
            <Link href="mailto:drrobot409@gmail.com">
              <a>drrobot409@gmail.com</a>
            </Link>
          </span>
        </div>
        <div>
          <span>
            <Link href="https://github.com/RAREBEEF/diary">
              <a>github</a>
            </Link>
          </span>
        </div>
        <div>
          <span>
            <Link href="https://velog.io/@drrobot409">
              <a>blog</a>
            </Link>
          </span>
        </div>
        <div>
          <span>
            <Link href="https://www.rarebeef.co.kr/">
              <a>more info</a>
            </Link>
          </span>
        </div>
      </section>

      <style jsx>{`
        @import "../styles/var.scss";

        footer {
          text-align: center;
          height: fit-content !important;
          min-height: auto !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 10px 10px 20px;
          gap: 10px;
          color: $gray-color;
          font: {
            weight: 700;
          }

          .contact {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            gap: 20px;
            row-gap: 5px;

            a {
              text-decoration: $gray-color underline;
            }
          }
          .copyright {
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
