import LoginForm from "./login-form/LoginForm";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";

function LoginPageContent({ userType }) {
  const { handleNavigateToPath } = useAppNavigate();

  return (
    <>
      <div className="login-page-header">
        <h2>
          <span className="login-heading-icon">🔐</span>
          Login as <span className="highlight">{userType}</span>
        </h2>
        <div className="login-header-underline"></div>
      </div>
      <div className="login-alter-link">
        Login as {userType === "individual" ? "firm" : "individual"}?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={() =>
            handleNavigateToPath(
              userType === "individual" ? "/login/firm" : "/login/individual"
            )
          }
        >
          Click here
        </button>
      </div>

      <div className="login-page-body">
        <LoginForm userType={userType} />
      </div>
    </>
  );
}

export default LoginPageContent;
