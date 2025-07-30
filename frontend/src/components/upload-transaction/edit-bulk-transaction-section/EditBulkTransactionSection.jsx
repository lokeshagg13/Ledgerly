import { useContext } from "react";

import TransactionUploadContext from "../../../store/context/transactionUploadContext";
import EditBulkTransactionTable from "./edit-bulk-transaction-table/EditBulkTransactionTable";

function EditBulkTransactionSection() {
  const { extractedTransactions, isEditTransactionSectionVisible } = useContext(
    TransactionUploadContext
  );

  if (!isEditTransactionSectionVisible || extractedTransactions?.length === 0)
    return <></>;

  return (
    <div className="bulk-transaction-section">
      <div className="bulk-transaction-header">
        <h3>Edit Transactions</h3>
      </div>
      <EditBulkTransactionTable />
    </div>
  );
}

export default EditBulkTransactionSection;
