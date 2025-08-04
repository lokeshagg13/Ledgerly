import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

import TransactionContext from "../../../store/context/transactionContext";
import TransactionFilterContext from "../../../store/context/transactionFilterContext";
import AddTransactionModal from "./add-transaction/AddTransactionModal";

function TransactionControl() {
  const {
    isLoadingTransactions,
    isAddTransactionModalVisible,
    fetchTransactions,
    handleOpenAddTransactionModal,
    handleCloseAddTransactionModal,
  } = useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToPrintTransactionsPage = () => {
    navigate("/transactions/print", {
      state: { from: location.pathname },
    });
  };

  const handleNavigateToUploadTransactionsPage = () => {
    navigate("/transactions/upload", {
      state: { from: location.pathname },
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
        onClick={handleNavigateToUploadTransactionsPage}
        disabled={isLoadingTransactions}
      >
        Upload Transactions
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Add a new transaction"
        onClick={handleNavigateToPrintTransactionsPage}
        disabled={isLoadingTransactions}
      >
        Print Transactions
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

      {isAddTransactionModalVisible && (
        <AddTransactionModal onClose={handleCloseAddTransactionModal} />
      )}
    </div>
  );
}

export default TransactionControl;
