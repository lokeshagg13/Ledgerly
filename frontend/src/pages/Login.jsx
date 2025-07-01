import LoginForm from "../components/login-user/LoginForm";
import PageLayout from "../components/ui/PageLayout";

function Login() {
  return (
    <PageLayout>
      <div className="page login-page">
        <h2>Login</h2>
        <LoginForm />
      </div>
    </PageLayout>
  );
}

export default Login;
