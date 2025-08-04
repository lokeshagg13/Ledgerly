import { useContext } from "react";
import { Button } from "react-bootstrap";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";

function FetchTransactionControl() {
  const {
    isLoadingTransactions,
    isPrintSectionVisible,
    handleResetAll,
    fetchTransactionsFromDB,
  } = useContext(TransactionPrintContext);

  const handleFetch = () => {
    if (isPrintSectionVisible) return;
    fetchTransactionsFromDB();
  };

  return (
    <div className="fetch-transaction-control">
      <Button
        className="fetch-transaction-button"
        onClick={handleFetch}
        disabled={isLoadingTransactions || isPrintSectionVisible}
      >
        {isLoadingTransactions ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Fetching...
          </>
        ) : (
          "Fetch Transactions"
        )}
      </Button>
      <Button
        className="reset-transaction-button"
        onClick={handleResetAll}
        disabled={isLoadingTransactions}
      >
        Reset
      </Button>
    </div>
  );
}

export default FetchTransactionControl;
