import { Button } from "react-bootstrap";
import ExtractTransactionForm from "./extract-transaction-form/ExtractTransactionForm";
import BulkTransactionSection from "./bulk-transaction-section/BulkTransactionSection";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { CategoryProvider } from "../../store/context/categoryContext";
import { TransactionUploadContextProvider } from "../../store/context/transactionUploadContext";
import useAppNavigate from "../../store/hooks/useAppNavigate";

function UploadTransactionPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <CategoryProvider>
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
    </CategoryProvider>
  );
}

export default UploadTransactionPageContent;
