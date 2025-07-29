import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";

function ExtractTransactionControl() {
  const { isExtractingTransactions, handleExtractTransactionsFromFile } =
    useContext(TransactionUploadContext);

  return (
    <div className="extract-transaction-control">
      <Button
        className="extract-transaction-button"
        onClick={handleExtractTransactionsFromFile}
        disabled={isExtractingTransactions}
      >
        {isExtractingTransactions ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Extracting...
          </>
        ) : (
          "Extract"
        )}
      </Button>
      <Button
        className="reset-button"
        onClick={() => {}}
        disabled={isExtractingTransactions}
      >
        Reset
      </Button>
    </div>
  );
}

export default ExtractTransactionControl;
