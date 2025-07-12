import { useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import LastNTransactionInput from "./last-n-transaction-input/LastNTransactionInput";
import DateFilters from "./transaction-filter-inputs/DateFilters";
import CategoryFilters from "./transaction-filter-inputs/CategoryFilters";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";

function FetchTransactionForm() {
  const {
    fetchMode,
    errorFetchingTransactions,
    isLoadingTransactions,
    setFetchMode,
    fetchCategoriesFromDB,
    fetchTransactionsFromDB,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  useEffect(() => {
    if (errorFetchingTransactions.errorMessage) {
      const timeout = setTimeout(() => resetErrorFetchingTransactions(), 8000);
      return () => clearTimeout(timeout);
    }
  }, [errorFetchingTransactions]);

  useEffect(() => {
    fetchCategoriesFromDB();
  }, []);

  const handleFetch = () => {
    fetchTransactionsFromDB();
  };

  return (
    <div className="fetch-transaction-section">
      <div className="fetch-transaction-header">
        <h5>Transactions Filter</h5>
      </div>
      <div className="fetch-transaction-form">
        <Form.Check
          type="radio"
          label={<LastNTransactionInput />}
          checked={fetchMode === "recent"}
          onChange={() => setFetchMode("recent")}
          className="last-n-transaction-radio"
        />
        <Form.Check
          type="radio"
          label={
            <>
              <div className="transaction-filter-label">Custom Filter</div>
              {fetchMode === "filtered" && (
                <div className="transaction-filter-form">
                  <DateFilters />
                  <CategoryFilters />
                </div>
              )}
            </>
          }
          checked={fetchMode === "filtered"}
          onChange={() => setFetchMode("filtered")}
          className="transaction-filter-radio"
        />

        {errorFetchingTransactions?.message && (
          <div className="fetch-transaction-error-message">
            {errorFetchingTransactions.message}
          </div>
        )}
        <Button className="fetch-transaction-button" onClick={handleFetch}>
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
      </div>
    </div>
  );
}

export default FetchTransactionForm;
