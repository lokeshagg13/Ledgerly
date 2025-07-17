import LoginPageContent from "../../components/user/login/LoginPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function LoginPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <LoginPageContent />
      </div>
    </PageLayout>
  );
}

export default LoginPage;
