import LoginPageContent from "../../components/user/login/login-common/LoginPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function LoginIndividualPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page login-page">
        <LoginPageContent userType="individual" />
      </div>
    </PageLayout>
  );
}

export default LoginIndividualPage;
