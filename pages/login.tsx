import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <section className="page-container">
      <LoginForm />
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </section>
  );
};

export default Login;
