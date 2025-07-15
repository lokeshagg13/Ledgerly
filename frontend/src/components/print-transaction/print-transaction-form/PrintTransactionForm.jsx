import { useContext, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import TransactionPrintContext from "../../../store/context/transactionPrintContext";
import PrintPreviewModal from "./show-print-preview/PrintPreviewModal";
import SaveTransactionModal from "./show-print-preview/save-transaction-modal/SaveTransactionModal";

function PrintTransactionForm() {
  const {
    transactions,
    isPrintSectionVisible,
    printStyle,
    isPrintPreviewVisible,
    isSaveTransactionModalVisible,
    setPrintStyle,
    handleOpenPrintPreview,
    handleOpenSaveTransactionModal,
  } = useContext(TransactionPrintContext);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (isPrintSectionVisible && !isPrintPreviewVisible) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isPrintSectionVisible, isPrintPreviewVisible]);

  if (!isPrintSectionVisible || transactions?.length === 0) return <></>;

  return (
    <div className="print-transaction-section" ref={sectionRef}>
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
            <Button
              variant="outline-secondary"
              onClick={handleOpenPrintPreview}
            >
              Show Preview
            </Button>
            <Button variant="primary" onClick={handleOpenSaveTransactionModal}>
              Save as PDF
            </Button>
            <Button variant="success">Print Transactions</Button>
          </div>

          {isPrintPreviewVisible && <PrintPreviewModal />}
          {isSaveTransactionModalVisible && !isPrintPreviewVisible && (
            <SaveTransactionModal />
          )}
        </div>
      </div>
    </div>
  );
}

export default PrintTransactionForm;
