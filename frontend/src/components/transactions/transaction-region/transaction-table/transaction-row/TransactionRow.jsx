import { useContext, useState } from "react";
import { Button } from "react-bootstrap";

import EditIcon from "../../../../ui/icons/EditIcon";
import TrashIcon from "../../../../ui/icons/TrashIcon";
import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../logic/utils";
import DeleteTransactionModal from "../transaction-modals/delete-transaction-modal/DeleteTransactionModal";
import EditTransactionModal from "../transaction-modals/edit-transaction-modal/EditTransactionModal";
import TransactionContext from "../../../../../store/context/transactionContext";

function TransactionRow({ transactionData }) {
  const { _id, date, amount, remarks, categoryName, subcategoryName } =
    transactionData;
  const { isEditTransactionModalVisible, openEditTransactionModal } =
    useContext(TransactionContext);
  const [isDeleteTransactionModalVisible, setIsDeleteTransactionModalVisible] =
    useState(false);

  return (
    <tr>
      <td>{formatDateForDisplay(date)}</td>
      <td>{formatAmountForDisplay(amount)}</td>
      <td>{remarks}</td>
      <td>{categoryName}</td>
      <td>{subcategoryName || "-"}</td>
      <td>
        <Button
          variant="link"
          onClick={() => openEditTransactionModal(transactionData)}
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

        {isEditTransactionModalVisible && <EditTransactionModal />}
      </td>
    </tr>
  );
}

export default TransactionRow;
