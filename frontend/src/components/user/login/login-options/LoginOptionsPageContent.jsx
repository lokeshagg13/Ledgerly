import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";

function LoginOptionsPageContent() {
  const { handleNavigateToPath } = useAppNavigate();

  return (
    <>
      <div className="login-options-page-header">
        <h1>Welcome</h1>
        <p>Please choose your login type to continue</p>
        <div className="login-options-page-header-underline"></div>
      </div>

      <div className="login-options-card">
        <Button
          type="button"
          variant="outline-primary"
          className="login-button login-individual-button"
          onClick={() => handleNavigateToPath("/login/individual")}
        >
          Login as Individual
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          className="login-button login-firm-button"
          onClick={() => handleNavigateToPath("/login/firm")}
        >
          Login as Firm
        </Button>
      </div>
    </>
  );
}

export default LoginOptionsPageContent;
