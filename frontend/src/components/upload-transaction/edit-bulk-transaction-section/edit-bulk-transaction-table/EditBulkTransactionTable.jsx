import { useContext } from "react";

import TransactionUploadContext from "../../../../store/context/transactionUploadContext";
import EditBulkTransactionRow from "./edit-bulk-transaction-row/EditBulkTransactionRow";

function EditBulkTransactionTable() {
  const { editableTransactions } = useContext(TransactionUploadContext);

  return (
    <div className="bulk-transaction-table-wrapper">
      <table className="bulk-transaction-table">
        <thead>
          <tr>
            <th></th>
            <th>S.No.</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Remarks</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {editableTransactions.map((data, index) => (
            <EditBulkTransactionRow key={index} index={index} data={data} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditBulkTransactionTable;
