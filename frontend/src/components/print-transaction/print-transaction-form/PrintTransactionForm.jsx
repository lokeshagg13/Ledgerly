import { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import TransactionPrintContext from "../../../store/context/transactionPrintContext";

function PrintTransactionForm() {
  const { isPrintSectionVisible, transactions, printStyle, setPrintStyle } =
    useContext(TransactionPrintContext);

  if (!isPrintSectionVisible || transactions?.length === 0) return <></>;

  return (
    <div className="print-transaction-section">
      <div className="print-transaction-header">
        <h5>Printing Style</h5>
      </div>
      <div className="print-transaction-form-wrapper">
        <div className="print-transaction-form">
          <div className="print-style-options">
            <Form.Check
              type="radio"
              label="CA File Style"
              checked={printStyle === "ca"}
              onChange={() => setPrintStyle("ca")}
              className="ca-print-style-radio"
            />
            <Form.Check
              type="radio"
              label="Table Style"
              checked={printStyle === "table"}
              onChange={() => setPrintStyle("table")}
              className="table-print-style-radio"
            />
          </div>
          <div className="print-transaction-control">
            <Button variant="outline-secondary">Show Preview</Button>
            <Button variant="primary">Save as PDF</Button>
            <Button variant="success">Print Transactions</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintTransactionForm;
