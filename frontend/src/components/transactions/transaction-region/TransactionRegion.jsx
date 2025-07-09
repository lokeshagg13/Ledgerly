import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import TransactionContext from "../../../store/context/transactionContext";
import TransactionTable from "./transaction-table/TransactionTable";

function TransactionRegion() {
  const { transactions, isLoadingTransactions, fetchTransactionsFromDB } =
    useContext(TransactionContext);
  const [showDebit, setShowDebit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);

  useEffect(() => {
    fetchTransactionsFromDB();
    // eslint-disable-next-line
  }, []);

  if (isLoadingTransactions) {
    return (
      <div className="transaction-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-table-empty text-muted">
        No Transactions added yet.
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
        </div>
        {showDebit && <TransactionTable type="debit" />}
      </div>

      <div className="transaction-section">
        <div
          className="transaction-section-header"
          onClick={() => setShowCredit(!showCredit)}
        >
          <h4>Credit Transactions</h4>
        </div>
        {showCredit && <TransactionTable type="credit" />}
      </div>
    </div>
  );
}

export default TransactionRegion;
