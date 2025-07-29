import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";

function ExtractTransactionStatus() {
  const {
    isExtractingTransactions,
    extractedTransactions,
    isEditTransactionSectionVisible,
  } = useContext(TransactionUploadContext);

  if (isExtractingTransactions) {
    return (
      <div className="transaction-extracting">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (!isEditTransactionSectionVisible) return <></>;

  if (extractedTransactions?.length === 0)
    return (
      <div className="transaction-empty warning-message">
        No transactions found
      </div>
    );

  return (
    <div className="transaction-extract-message">
      {extractedTransactions.length} transactions extracted successfully.
    </div>
  );
}

export default ExtractTransactionStatus;
