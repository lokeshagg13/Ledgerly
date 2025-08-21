import LoginPageContent from "../../components/user/login/login-common/LoginPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function LoginFirmPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <LoginPageContent userType="firm" />
      </div>
    </PageLayout>
  );
}

export default LoginFirmPage;
