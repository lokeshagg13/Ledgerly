import { useContext, useState } from "react";
import { Button } from "react-bootstrap";

import TransactionContext from "../../../store/context/transactionContext";
import TransactionFilterContext from "../../../store/context/transactionFilterContext";
import AddTransactionModal from "./add-transaction/AddTransactionModal";
import PrintTransactionModal from "./print-transaction/PrintTransactionModal";
import { TransactionPrintContextProvider } from "../../../store/context/transactionPrintContext";

function TransactionControl() {
  const { isLoadingTransactions, fetchTransactions } =
    useContext(TransactionContext);

  const { appliedFilters } = useContext(TransactionFilterContext);
  const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] =
    useState(false);
  const [isPrintTransactionModalVisible, setIsPrintTransactionModalVisible] =
    useState(false);

  const handleOpenAddTransactionModal = () => {
    setIsAddTransactionModalVisible(true);
  };

  const handleCloseAddTransactionModal = () => {
    setIsAddTransactionModalVisible(false);
  };

  const handleOpenPrintTransactionModal = () => {
    setIsPrintTransactionModalVisible(true);
  };

  const handleClosePrintTransactionModal = () => {
    setIsPrintTransactionModalVisible(false);
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
        aria-label="Add a new transaction"
        onClick={handleOpenPrintTransactionModal}
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
      {isPrintTransactionModalVisible && (
        <TransactionPrintContextProvider>
          <PrintTransactionModal onClose={handleClosePrintTransactionModal} />
        </TransactionPrintContextProvider>
      )}
    </div>
  );
}

export default TransactionControl;
