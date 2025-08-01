import { useContext, useEffect } from "react";

import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import EditBulkTransactionTable from "./edit-bulk-transaction-table/EditBulkTransactionTable";
import EditBulkTransactionControl from "./edit-bulk-transaction-control/EditBulkTransactionControl";

function EditBulkTransactionSection() {
  const {
    extractedTransactions,
    isEditTransactionSectionVisible,
    errorUploadingTransactions,
    resetErrorUploadingTransactions,
  } = useContext(TransactionUploadContext);

  useEffect(() => {
    if (errorUploadingTransactions) {
      const timeout = setTimeout(() => {
        resetErrorUploadingTransactions();
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorUploadingTransactions, resetErrorUploadingTransactions]);

  if (!isEditTransactionSectionVisible || extractedTransactions?.length === 0)
    return null;

  return (
    <div className="bulk-transaction-section">
      <div className="bulk-transaction-header">
        <h3>Edit Transactions</h3>
      </div>
      <EditBulkTransactionTable />
      {errorUploadingTransactions && (
        <div className="error-message" role="alert" aria-live="polite">
          {errorUploadingTransactions}
        </div>
      )}
      <EditBulkTransactionControl />
    </div>
  );
}

export default EditBulkTransactionSection;
