import RegisterPageContent from "../../components/user/register/RegisterPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function RegisterPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page register-page">
        <RegisterPageContent />
      </div>
    </PageLayout>
  );
}

export default RegisterPage;
