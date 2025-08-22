import UploadTransactionPageContent from "../../components/upload-transaction/UploadTransactionPageContent";
import PageLayout from "../../components/ui/page-layout/PageLayout";
import uploadImage from "../../images/upload-txn-bg.png";

function UploadTransactionPage() {
  return (
    <PageLayout bgImage={uploadImage}>
      <div className="page upload-transaction-page">
        <UploadTransactionPageContent />
      </div>
    </PageLayout>
  );
}

export default UploadTransactionPage;
