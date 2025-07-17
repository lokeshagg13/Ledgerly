import LoginForm from "../../components/login-user/LoginForm";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function LoginPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <h2>Login</h2>
        <LoginForm />
      </div>
    </PageLayout>
  );
}

export default LoginPage;
