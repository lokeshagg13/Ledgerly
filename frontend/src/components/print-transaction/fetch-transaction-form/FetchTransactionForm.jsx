import { useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import LastNTransactionInput from "./last-n-transaction-input/LastNTransactionInput";
import DateFilters from "./transaction-filter-inputs/DateFilterInputs";
import CategoryFilters from "./transaction-filter-inputs/CategoryFilterInput";
import TransactionPrintContext from "../../../store/context/transactionPrintContext";
import TransactionFetchStatus from "./fetch-transaction-status/TransactionFetchStatus";

function FetchTransactionForm() {
  const {
    fetchMode,
    errorFetchingTransactions,
    isLoadingTransactions,
    isPrintSectionVisible,
    setFetchMode,
    fetchCategoriesFromDB,
    fetchTransactionsFromDB,
    resetAll,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  useEffect(() => {
    if (errorFetchingTransactions.mesesage) {
      const timeout = setTimeout(() => resetErrorFetchingTransactions(), 8000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [errorFetchingTransactions]);

  useEffect(() => {
    fetchCategoriesFromDB();
    // eslint-disable-next-line
  }, []);

  const handleFetch = () => {
    if (isPrintSectionVisible) return;
    fetchTransactionsFromDB();
  };

  const handleModifyFetchMode = (newMode) => {
    if (isPrintSectionVisible) return;
    resetErrorFetchingTransactions();
    setFetchMode(newMode);
  };

  return (
    <div className="fetch-transaction-section">
      <div className="fetch-transaction-header">
        <h5>Printing Range</h5>
      </div>
      <div className="fetch-transaction-body-wrapper">
        <div className="fetch-transaction-body">
          <div className="fetch-transaction-form">
            <div className="fetch-transaction-form-options">
              <Form.Check
                type="radio"
                label={<LastNTransactionInput />}
                checked={fetchMode === "recent"}
                onChange={() => handleModifyFetchMode("recent")}
                className="last-n-transaction-radio"
                disabled={isPrintSectionVisible}
              />
              <div className="fetch-transaction-filter-option">
                <Form.Check
                  type="radio"
                  label={
                    <div className="transaction-filter-label">
                      Custom Filter
                    </div>
                  }
                  checked={fetchMode === "filtered"}
                  onChange={() => handleModifyFetchMode("filtered")}
                  className="transaction-filter-radio"
                  disabled={isPrintSectionVisible}
                />
                {fetchMode === "filtered" && (
                  <div className="transaction-filter-form">
                    <DateFilters />
                    <CategoryFilters />
                  </div>
                )}
              </div>
            </div>
            {errorFetchingTransactions?.message &&
              errorFetchingTransactions?.type === "input" && (
                <div className="fetch-transaction-error-message">
                  {errorFetchingTransactions.message}
                </div>
              )}
            <div className="fetch-transaction-control">
              <Button
                className="fetch-transaction-button"
                onClick={handleFetch}
                disabled={isPrintSectionVisible}
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
              <Button className="reset-transaction-button" onClick={resetAll}>
                Reset
              </Button>
            </div>
          </div>
          <div className="fetch-transaction-status">
            <TransactionFetchStatus />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FetchTransactionForm;
