const Footer = () => {
  return (
    <footer className="container">
      &copy; {new Date().getFullYear()}. RAREBEEF All Rights Reserved.
      <style jsx>{`
        footer {
          height: 50px !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
