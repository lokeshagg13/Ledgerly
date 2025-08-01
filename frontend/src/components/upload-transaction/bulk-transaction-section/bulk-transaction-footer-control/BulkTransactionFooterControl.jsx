import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";

function BulkTransactionFooterControl() {
  const { isUploadingBulkTransactions, handleUploadBulkTransactions } = useContext(
    TransactionUploadContext
  );

  return (
    <div className="bulk-transaction-footer-control">
      <Button
        className="btn-blue"
        onClick={handleUploadBulkTransactions}
        disabled={isUploadingBulkTransactions}
      >
        {isUploadingBulkTransactions ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Uploading...
          </>
        ) : (
          "Upload All"
        )}
      </Button>
    </div>
  );
}

export default BulkTransactionFooterControl;
