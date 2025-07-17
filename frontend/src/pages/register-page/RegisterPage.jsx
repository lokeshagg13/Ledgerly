import RegisterUserForm from "../../components/register-user/RegisterUserForm";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import officeImage from "../../images/office-bg.png";

function RegisterPage() {
  return (
    <PageLayout bgImage={officeImage}>
      <div className="page register-page">
        <h2>Register here</h2>
        <RegisterUserForm />
      </div>
    </PageLayout>
  );
}

export default RegisterPage;
