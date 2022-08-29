import Nav from "./Nav";

interface Props {
  children: React.PropsWithChildren;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <Nav />
    </>
  );
};

export default Layout;
