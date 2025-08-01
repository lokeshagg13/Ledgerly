import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";

function BulkTransactionTopControl() {
  const {
    isUploadingBulkTransactions,
    checkIfAnyTransactionSelected,
    handleResetSelectedTransactions,
    handleRemoveSelectedTransactions,
  } = useContext(TransactionUploadContext);

  const isAnyTransactionSelected = checkIfAnyTransactionSelected();

  return (
    <div className="bulk-transaction-top-control-wrapper">
      <div className="bulk-transaction-top-control">
        <Link to="/categories">
          <Button className="btn-blue" disabled={isUploadingBulkTransactions}>
            Manage Categories
          </Button>
        </Link>
        <Button
          className="btn-outline"
          onClick={handleResetSelectedTransactions}
          disabled={isUploadingBulkTransactions || !isAnyTransactionSelected}
        >
          Reset Selected
        </Button>
        <Button
          className="btn-outline"
          onClick={handleRemoveSelectedTransactions}
          disabled={isUploadingBulkTransactions || !isAnyTransactionSelected}
        >
          Remove Selected
        </Button>
      </div>
    </div>
  );
}

export default BulkTransactionTopControl;
