import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../../../store/context/transactionUploadContext";
import TrashIcon from "../../../../../ui/icons/TrashIcon";
import RotateIcon from "../../../../../ui/icons/RotateIcon";

function BulkTransactionRowControl({ _id }) {
  const { handleRemoveTransaction, handleResetTransaction } = useContext(
    TransactionUploadContext
  );

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
        onClick={() => handleRemoveTransaction(_id)}
        title="Remove this transaction"
      >
        <TrashIcon fill="red" width="0.9rem" height="0.9rem" />
      </Button>
    </div>
  );
}

export default BulkTransactionRowControl;
