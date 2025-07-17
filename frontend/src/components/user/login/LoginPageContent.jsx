import LoginForm from "./login-form/LoginForm";

function LoginPageContent() {
  return (
    <>
      <div className="login-page-header">
        <h2>Login</h2>
      </div>

      <div className="login-page-body">
        <LoginForm />
      </div>
    </>
  );
}

export default LoginPageContent;
