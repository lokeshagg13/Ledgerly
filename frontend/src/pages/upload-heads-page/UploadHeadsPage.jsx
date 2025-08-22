import PageLayout from "../../components/ui/page-layout/PageLayout";
import UploadHeadsPageContent from "../../components/upload-heads/UploadHeadsPageContent";
import uploadImage from "../../images/upload-heads-bg.png";

function UploadHeadsPage() {
  return (
    <PageLayout bgImage={uploadImage}>
      <div className="page upload-heads-page">
        <UploadHeadsPageContent />
      </div>
    </PageLayout>
  );
}

export default UploadHeadsPage;
