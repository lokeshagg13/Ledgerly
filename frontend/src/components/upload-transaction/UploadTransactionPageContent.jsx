import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ExtractTransactionForm from "./extract-transaction-form/ExtractTransactionForm";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { TransactionUploadContextProvider } from "../../store/context/transactionUploadContext";
import BulkTransactionSection from "./bulk-transaction-section/BulkTransactionSection";

function UploadTransactionPageContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    const previousPage = location.state?.from || "/dashboard";
    navigate(previousPage);
  };

  return (
    <TransactionUploadContextProvider>
      <div className="upload-transaction-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Upload Transactions</h2>
      </div>

      <div className="upload-transaction-page-body-wrapper">
        <div className="upload-transaction-page-body">
          <ExtractTransactionForm />
          <BulkTransactionSection />
        </div>
      </div>
    </TransactionUploadContextProvider>
  );
}

export default UploadTransactionPageContent;
