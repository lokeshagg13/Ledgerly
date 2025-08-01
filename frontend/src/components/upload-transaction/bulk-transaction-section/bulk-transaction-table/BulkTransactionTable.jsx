import { useContext } from "react";

import TransactionUploadContext from "../../../../store/context/transactionUploadContext";
import BulkTransactionRow from "./bulk-transaction-row/BulkTransactionRow";
import { Form } from "react-bootstrap";

function BulkTransactionTable() {
  const {
    editableTransactions,
    checkIfAllTransactionSelected,
    handleToggleAllTransactionSelections,
  } = useContext(TransactionUploadContext);

  return (
    <div className="bulk-transaction-table-wrapper">
      <table className="bulk-transaction-table" role="table">
        <thead>
          <tr role="row">
            <th scope="col">
              <Form.Check
                type="checkbox"
                className="bulk-transaction-all-checkbox"
                id={`editBulkTransactionAllCheckbox`}
                checked={checkIfAllTransactionSelected()}
                onChange={() => handleToggleAllTransactionSelections()}
                aria-label={`${
                  checkIfAllTransactionSelected() ? "Unselect" : "Select"
                } all transactions`}
              />
            </th>
            <th scope="col">S.No.</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Category</th>
            <th scope="col">Subcategory</th>
            <th scope="col">Remarks</th>
            <th scope="col">Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {editableTransactions.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-table-message">
                No transactions to edit.
              </td>
            </tr>
          ) : (
            editableTransactions.map((data, index) => (
              <BulkTransactionRow key={data._id} index={index} data={data} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BulkTransactionTable;
