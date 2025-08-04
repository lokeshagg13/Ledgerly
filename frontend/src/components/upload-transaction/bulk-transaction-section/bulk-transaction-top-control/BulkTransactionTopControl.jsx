import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";

function BulkTransactionTopControl() {
  const { handleNavigateToPath } = useAppNavigate();
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
        <Button
          className="btn-blue"
          disabled={isUploadingBulkTransactions}
          onClick={() => handleNavigateToPath("/categories")}
        >
          Manage Categories
        </Button>
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
