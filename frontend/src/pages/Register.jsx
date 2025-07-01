import RegisterUserForm from "../components/register-user/RegisterUserForm";
import PageLayout from "../components/ui/PageLayout";

function Register() {
  return (
    <PageLayout>
      <div className="page register-page">
        <h2>Register here</h2>
        <RegisterUserForm />
      </div>
    </PageLayout>
  );
}

export default Register;
