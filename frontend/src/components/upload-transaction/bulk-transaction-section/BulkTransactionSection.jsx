import { useContext, useEffect } from "react";

import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import BulkTransactionTable from "./bulk-transaction-table/BulkTransactionTable";
import BulkTransactionFooterControl from "./bulk-transaction-footer-control/BulkTransactionFooterControl";
import BulkTransactionTopControl from "./bulk-transaction-top-control/BulkTransactionTopControl";

function BulkTransactionSection() {
  const {
    extractedTransactions,
    isEditTransactionSectionVisible,
    errorUploadingTransactions,
    handleResetErrorUploadingTransactions,
  } = useContext(TransactionUploadContext);

  useEffect(() => {
    if (errorUploadingTransactions) {
      const timeout = setTimeout(() => {
        handleResetErrorUploadingTransactions();
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorUploadingTransactions, handleResetErrorUploadingTransactions]);

  if (!isEditTransactionSectionVisible || extractedTransactions?.length === 0)
    return null;

  return (
    <div className="bulk-transaction-section">
      <div className="bulk-transaction-header">
        <h3>Edit Transactions</h3>
      </div>
      <BulkTransactionTopControl />
      <BulkTransactionTable />
      {errorUploadingTransactions && (
        <div className="error-message" role="alert" aria-live="polite">
          {errorUploadingTransactions}
        </div>
      )}
      <BulkTransactionFooterControl />
    </div>
  );
}

export default BulkTransactionSection;
