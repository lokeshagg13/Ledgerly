import RegiserForm from "./register-form/RegisterForm";

function RegisterPageContent() {
  return (
    <>
      <div className="register-page-header">
        <h2>Register Here</h2>
      </div>

      <div className="register-page-body">
        <RegiserForm />
      </div>
    </>
  );
}

export default RegisterPageContent;
