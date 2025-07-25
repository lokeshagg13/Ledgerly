import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import LeftArrowIcon from "../../ui/icons/LeftArrowIcon";
import UserProfileForm from "./user-profile-form/UserProfileForm";
import PasswordUpdateForm from "./password-update-form/PasswordUpdateForm";

function UserProfilePageContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const userProfileRef = useRef();
  const profileInfoRef = useRef();
  const changePasswordRef = useRef();

  const handleNavigateBack = () => {
    const previousPage = location.state?.from || "/dashboard";
    navigate(previousPage);
  };

  useEffect(() => {
    if (location.hash === "#change-password" && changePasswordRef.current) {
      changePasswordRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (location.hash === "#profile-info" && profileInfoRef.current) {
      profileInfoRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      userProfileRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div ref={userProfileRef}>
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
        <div ref={profileInfoRef} id="profile-info">
          <UserProfileForm />
        </div>
        <hr />
        <div ref={changePasswordRef} id="change-password">
          <PasswordUpdateForm />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePageContent;
