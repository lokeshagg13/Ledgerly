import { useContext } from "react";

import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import EditBulkTransactionTable from "./edit-bulk-transaction-table/EditBulkTransactionTable";
import EditBulkTransactionControl from "./edit-bulk-transaction-control/EditBulkTransactionControl";

function EditBulkTransactionSection() {
  const {
    extractedTransactions,
    isEditTransactionSectionVisible,
    errorUploadingTransactions,
  } = useContext(TransactionUploadContext);

  if (!isEditTransactionSectionVisible || extractedTransactions?.length === 0)
    return <></>;

  return (
    <div className="bulk-transaction-section">
      <div className="bulk-transaction-header">
        <h3>Edit Transactions</h3>
      </div>
      <EditBulkTransactionTable />
      {errorUploadingTransactions && (
        <div className="error-message">{errorUploadingTransactions}</div>
      )}
      <EditBulkTransactionControl />
    </div>
  );
}

export default EditBulkTransactionSection;
