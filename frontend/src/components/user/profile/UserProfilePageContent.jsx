import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import LeftArrowIcon from "../../ui/icons/LeftArrowIcon";
import UserProfileForm from "./user-profile-form/UserProfileForm";
import PasswordUpdateForm from "./password-update-form/PasswordUpdateForm";

function UserProfilePageContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    const previousPage = location.state?.from || "/dashboard";
    navigate(previousPage);
  };

  return (
    <>
      <div className="user-profile-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Manage your profile</h2>
      </div>
      <div className="user-profile-page-body">
        <UserProfileForm />
        <hr />
        <PasswordUpdateForm />
      </div>
    </>
  );
}

export default UserProfilePageContent;
