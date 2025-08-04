import { useContext, useState } from "react";
import { Button } from "react-bootstrap";

import EditIcon from "../../../../ui/icons/EditIcon";
import TrashIcon from "../../../../ui/icons/TrashIcon";
import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../utils/formatUtils";
import DeleteTransactionModal from "../transaction-modals/delete-transaction-modal/DeleteTransactionModal";
import TransactionContext from "../../../../../store/context/transactionContext";

function TransactionRow({ transactionData }) {
  const { _id, date, amount, remarks, categoryName, subcategoryName } =
    transactionData;
  const { handleOpenEditTransactionModal } = useContext(TransactionContext);
  const [isDeleteTransactionModalVisible, setIsDeleteTransactionModalVisible] =
    useState(false);

  return (
    <tr>
      <td>{formatDateForDisplay(date)}</td>
      <td>{formatAmountForDisplay(amount)}</td>
      <td>{categoryName}</td>
      <td>{subcategoryName || "-"}</td>
      <td>{remarks}</td>
      <td>
        <Button
          variant="link"
          onClick={() => handleOpenEditTransactionModal(transactionData)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="link"
          onClick={() => setIsDeleteTransactionModalVisible(true)}
        >
          <TrashIcon />
        </Button>
        {isDeleteTransactionModalVisible && (
          <DeleteTransactionModal
            transactionId={_id}
            transactionData={transactionData}
            onClose={() => setIsDeleteTransactionModalVisible(false)}
          />
        )}
      </td>
    </tr>
  );
}

export default TransactionRow;
