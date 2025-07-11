import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import TransactionContext from "../../../store/context/transactionContext";
import TransactionTable from "./transaction-table/TransactionTable";
import CaretDownIcon from "../../ui/icons/CaretDownIcon";
import TransactionFilterContext from "../../../store/context/transactionFilterContext";
import TransactionErrorModal from "./TransactionErrorModal";

function TransactionTables() {
  const {
    transactions,
    isLoadingTransactions,
    errorFetchingTransactions,
    resetErrorFetchingTransactions,
    fetchTransactions,
  } = useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);
  const [showDebit, setShowDebit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);

  useEffect(() => {
    fetchTransactions(appliedFilters);
    // eslint-disable-next-line
  }, [appliedFilters]);

  if (isLoadingTransactions) {
    return (
      <div className="transaction-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (transactions.length === 0) {
    if (errorFetchingTransactions) {
      return (
        <>
          <div className="transaction-table-empty text-muted error-message">
            Transaction Error
          </div>
          <TransactionErrorModal
            message={errorFetchingTransactions}
            onTryAgain={() => {
              resetErrorFetchingTransactions();
              fetchTransactions(appliedFilters);
            }}
          />
        </>
      );
    }
    return (
      <div className="transaction-table-empty text-muted">
        No Transactions {appliedFilters ? "found." : "added yet."}
      </div>
    );
  }

  return (
    <div className="transaction-region">
      <div className="transaction-section">
        <div
          className="transaction-section-header"
          onClick={() => setShowDebit(!showDebit)}
        >
          <h4>Debit Transactions</h4>
          <div
            className={`transaction-section-dropdown ${showDebit ? "up" : ""}`}
          >
            <CaretDownIcon fill="white" width="1.4em" height="1.4em" />
          </div>
        </div>
        {showDebit && <TransactionTable type="debit" />}
      </div>
      <div className="transaction-section">
        <div
          className="transaction-section-header"
          onClick={() => setShowCredit(!showCredit)}
        >
          <h4>Credit Transactions</h4>
          <div
            className={`transaction-section-dropdown ${showCredit ? "up" : ""}`}
          >
            <CaretDownIcon fill="white" width="1.4em" height="1.4em" />
          </div>
        </div>
        {showCredit && <TransactionTable type="credit" />}
      </div>
    </div>
  );
}

export default TransactionTables;
