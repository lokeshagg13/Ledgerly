import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";
import BulkTransactionRemoveModal from "./bulk-transaction-remove-modal/BulkTransactionRemoveModal";

function BulkTransactionTopControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const {
    isUploadingBulkTransactions,
    checkIfAnyTransactionSelected,
    handleResetSelectedTransactions,
    handleRemoveSelectedTransactions,
  } = useContext(TransactionUploadContext);
  const [
    isRemoveSelectedTransactionsModalVisible,
    setIsRemoveSelectedTransactionsModalVisible,
  ] = useState(false);

  const handleOpenRemoveSelectedTransactionsModal = () => {
    setIsRemoveSelectedTransactionsModalVisible(true);
  };

  const handleCloseRemoveSelectedTransactionsModal = () => {
    setIsRemoveSelectedTransactionsModalVisible(false);
  };

  const handleConfirmRemoveSelectedTransactionsModal = () => {
    handleRemoveSelectedTransactions();
    handleCloseRemoveSelectedTransactionsModal();
  };

  const handleCancelRemoveSelectedTransactionsModal = () => {
    handleCloseRemoveSelectedTransactionsModal();
  };

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
          onClick={handleOpenRemoveSelectedTransactionsModal}
          disabled={isUploadingBulkTransactions || !isAnyTransactionSelected}
        >
          Remove Selected
        </Button>
        {isRemoveSelectedTransactionsModalVisible && (
          <BulkTransactionRemoveModal
            show={isRemoveSelectedTransactionsModalVisible}
            onConfirm={handleConfirmRemoveSelectedTransactionsModal}
            onClose={handleCancelRemoveSelectedTransactionsModal}
          />
        )}
      </div>
    </div>
  );
}

export default BulkTransactionTopControl;
