import { useContext } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";

function PrintTransactionForm() {
  const {
    isLoadingTransactions,
    errorFetchingTransactions,
    transactions,
    printStyle,
    setPrintStyle,
  } = useContext(TransactionPrintContext);

  if (isLoadingTransactions) {
    return (
      <div className="transaction-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (errorFetchingTransactions.message || transactions.length === 0)
    return <></>;

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
