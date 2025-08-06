import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../../../store/context/transactionUploadContext";
import TrashIcon from "../../../../../ui/icons/TrashIcon";
import RotateIcon from "../../../../../ui/icons/RotateIcon";
import BulkTransactionRowRemoveModal from "./bulk-transaction-row-remove-modal/BulkTransactionRowRemoveModal";

function BulkTransactionRowControl({ index, _id }) {
  const { handleRemoveTransaction, handleResetTransaction } = useContext(
    TransactionUploadContext
  );
  const [isRemoveTransactionModalVisible, setIsRemoveTransactionModalVisible] =
    useState(false);

  const handleOpenRemoveTransactionModal = () => {
    setIsRemoveTransactionModalVisible(true);
  };

  const handleCloseRemoveTransactionModal = () => {
    setIsRemoveTransactionModalVisible(false);
  };

  const handleConfirmRemoveTransactionModal = () => {
    handleRemoveTransaction(_id);
    handleCloseRemoveTransactionModal();
  };

  const handleCancelRemoveTransactionModal = () => {
    handleCloseRemoveTransactionModal();
  };

  return (
    <div className="bulk-transaction-row-control">
      <Button
        type="button"
        className="reset-btn"
        onClick={() => handleResetTransaction(_id)}
        title="Reset back to original extracted content"
      >
        <RotateIcon width="0.9rem" height="0.9rem" />
      </Button>

      <Button
        type="button"
        className="delete-btn"
        onClick={handleOpenRemoveTransactionModal}
        title="Remove this transaction"
      >
        <TrashIcon fill="red" width="0.9rem" height="0.9rem" />
      </Button>

      {isRemoveTransactionModalVisible && (
        <BulkTransactionRowRemoveModal
          transactionIdx={index}
          show={isRemoveTransactionModalVisible}
          onClose={handleCancelRemoveTransactionModal}
          onConfirm={handleConfirmRemoveTransactionModal}
        />
      )}
    </div>
  );
}

export default BulkTransactionRowControl;
