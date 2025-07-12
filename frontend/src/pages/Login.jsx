import LoginForm from "../components/login-user/LoginForm";
import PageLayout from "../components/ui/PageLayout";
import officeImage from "../images/office-bg.png";

function Login() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <h2>Login</h2>
        <LoginForm />
      </div>
    </PageLayout>
  );
}

export default Login;
