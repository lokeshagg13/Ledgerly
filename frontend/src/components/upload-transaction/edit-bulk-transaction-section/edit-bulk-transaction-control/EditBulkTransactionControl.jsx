import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";

function EditBulkTransactionControl() {
  const { isUploadingBulkTransactions, handleUploadBulkTransactions } = useContext(
    TransactionUploadContext
  );

  return (
    <div className="edit-bulk-transaction-control">
      <Button
        className="edit-bulk-transaction-button"
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

export default EditBulkTransactionControl;
