import PageLayout from "../../components/ui/page-layout/PageLayout";
import UserProfilePageContent from "../../components/user/profile/UserProfilePageContent";
import userProfileImage from "../../images/user-profile-bg.png";

function UserProfilePage() {
  return (
    <PageLayout bgImage={userProfileImage}>
      <div className="page user-profile-page">
        <UserProfilePageContent />
      </div>
    </PageLayout>
  );
}

export default UserProfilePage;
