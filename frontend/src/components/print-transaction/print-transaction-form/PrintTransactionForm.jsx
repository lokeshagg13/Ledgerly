import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import TransactionPrintContext from "../../../store/context/transactionPrintContext";
import PrintPreviewModal from "./show-print-preview/PrintPreviewModal";

function PrintTransactionForm() {
  const [showPreview, setShowPreview] = useState(false);
  const { isPrintSectionVisible, transactions, printStyle, setPrintStyle } =
    useContext(TransactionPrintContext);

  if (!isPrintSectionVisible || transactions?.length === 0) return <></>;

  const handleOpenPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

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
            <Button variant="outline-secondary" onClick={handleOpenPreview}>
              Show Preview
            </Button>
            <Button variant="primary">Save as PDF</Button>
            <Button variant="success">Print Transactions</Button>
          </div>

          {showPreview && (
            <PrintPreviewModal show={showPreview} onClose={handleClosePreview} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PrintTransactionForm;
