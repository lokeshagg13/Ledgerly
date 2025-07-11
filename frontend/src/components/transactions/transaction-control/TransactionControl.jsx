import { useContext } from "react";
import { Button } from "react-bootstrap";

import TransactionContext from "../../../store/context/transactionContext";
import AddTransactionModal from "./add-transaction/AddTransactionModal";
import TransactionFilterContext from "../../../store/context/transactionFilterContext";

function TransactionControl() {
  const {
    isLoadingTransactions,
    isAddTransactionModalVisible,
    openAddTransactionModal,
    fetchTransactions,
  } = useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);

  return (
    <div className="transaction-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new transaction"
        onClick={openAddTransactionModal}
        disabled={isLoadingTransactions}
      >
        Add Transaction
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload transactions"
        onClick={() => fetchTransactions(appliedFilters)}
        disabled={isLoadingTransactions}
        title="Click to reload your transactions"
      >
        {isLoadingTransactions ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Refreshing...
          </>
        ) : (
          "Refresh Transactions"
        )}
      </Button>

      {isAddTransactionModalVisible && <AddTransactionModal />}
    </div>
  );
}

export default TransactionControl;
