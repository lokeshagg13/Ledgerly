import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";
import LoginOptionsPageContent from "../../components/user/login/login-options/LoginOptionsPageContent";

function LoginPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <LoginOptionsPageContent />
      </div>
    </PageLayout>
  );
}

export default LoginPage;
