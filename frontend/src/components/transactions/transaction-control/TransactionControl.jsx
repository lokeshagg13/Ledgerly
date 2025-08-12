import { useContext } from "react";
import { Button } from "react-bootstrap";

import TransactionContext from "../../../store/context/transactionContext";
import TransactionFilterContext from "../../../store/context/transactionFilterContext";
import AddTransactionModal from "./add-transaction/AddTransactionModal";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import { toast } from "react-toastify";

function TransactionControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const {
    isLoadingTransactions,
    isAddTransactionModalVisible,
    fetchTransactions,
    handleOpenAddTransactionModal,
    handleCloseAddTransactionModal,
  } = useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);

  const handleRefreshTransactions = () => {
    fetchTransactions(appliedFilters);
    toast.success("Refresh completed.", {
      autoClose: 500,
      position: "top-center",
    });
  };

  return (
    <div className="transaction-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new transaction"
        onClick={handleOpenAddTransactionModal}
        disabled={isLoadingTransactions}
      >
        Add Transaction
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Upload transactions"
        onClick={() => handleNavigateToPath("/transactions/upload")}
        disabled={isLoadingTransactions}
      >
        Upload Transactions
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Add a new transaction"
        onClick={() => handleNavigateToPath("/transactions/print")}
        disabled={isLoadingTransactions}
      >
        Print Transactions
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload transactions"
        onClick={handleRefreshTransactions}
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

      {isAddTransactionModalVisible && (
        <AddTransactionModal onClose={handleCloseAddTransactionModal} />
      )}
    </div>
  );
}

export default TransactionControl;
