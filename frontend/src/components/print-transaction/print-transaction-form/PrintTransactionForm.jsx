import { useContext } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import TransactionPrintContext from "../../../store/context/transactionPrintContext";
import TransactionErrorModal from "./TransactionErrorModal";

function PrintTransactionForm() {
  const {
    isLoadingTransactions,
    errorFetchingTransactions,
    transactions,
    printStyle,
    fetchTransactionsFromDB,
    setPrintStyle,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  if (isLoadingTransactions) {
    return (
      <div className="print-transaction-fetching">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (transactions?.length === 0)
    return (
      <div className="print-transaction-empty text-muted">
        No Transactions found
      </div>
    );

  if (
    errorFetchingTransactions?.message &&
    errorFetchingTransactions?.type === "api"
  ) {
    return (
      <>
        <div className="print-transactions-empty text-muted error-message">
          Transaction Error
        </div>
        <TransactionErrorModal
          message={errorFetchingTransactions.message}
          onTryAgain={() => {
            resetErrorFetchingTransactions();
            fetchTransactionsFromDB();
          }}
        />
      </>
    );
  }
  
  return (
    <div className="print-transaction-section">
      <div className="transactions-fetched-message">
        {transactions.length} transactions fetched successfully.
      </div>
      <div className="print-transaction-form">
        <strong>Printing Style</strong>
        <Form.Check
          type="radio"
          label="CA File Style"
          checked={printStyle === "ca"}
          onChange={() => setPrintStyle("ca")}
        />
        <Form.Check
          type="radio"
          label="Table Style"
          checked={printStyle === "table"}
          onChange={() => setPrintStyle("table")}
        />
      </div>
      <div className="print-transaction-control">
        <Button variant="outline-secondary">Show Preview</Button>
        <Button variant="primary">Save as PDF</Button>
        <Button variant="success">Print Transactions</Button>
      </div>
    </div>
  );
}

export default PrintTransactionForm;
