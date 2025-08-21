import RegiserForm from "./register-form/RegisterForm";

function RegisterPageContent() {
  return (
    <>
      <div className="register-page-header">
        <h2>
          <span className="register-heading-icon">📝</span>
          <span className="highlight">Register</span> Here
        </h2>
        <div className="register-header-underline"></div>
      </div>

      <div className="register-page-body">
        <RegiserForm />
      </div>
    </>
  );
}

export default RegisterPageContent;
