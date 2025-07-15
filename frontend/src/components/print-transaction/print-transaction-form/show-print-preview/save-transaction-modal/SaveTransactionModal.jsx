import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";
import AppliedFiltersInfo from "./AppliedFiltersInfo";

function SaveTransactionModal() {
  const fileNameRef = useRef();
  const {
    isSaveTransactionModalVisible,
    handleCloseSaveTransactionModal,
    handleSaveTransactionsAsPDF,
  } = useContext(TransactionPrintContext);
  const [fileName, setFileName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (isSaveTransactionModalVisible) {
      fileNameRef.current?.focus();
    }
  }, [isSaveTransactionModalVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (fileName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [fileName, errorMessage]);

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    if (!isSaveTransactionModalVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSaving) {
        e.preventDefault();
        handleCancel();
      } else if (
        e.key === "Enter" &&
        document.activeElement === fileNameRef.current &&
        !isSaving
      ) {
        e.preventDefault();
        handleSaveTransactions();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isSaveTransactionModalVisible, isSaving]);

  const handleSaveTransactions = async () => {
    const fileNameTrimmed = fileName.trim();
    if (!fileNameTrimmed) {
      setErrorMessage("File name cannot be empty.");
      return;
    }

    const invalidChars = /[\\/:*?"<>|]/;
    if (invalidChars.test(fileNameTrimmed)) {
      setErrorMessage("File name contains invalid characters.");
      return;
    }

    const finalFileName = fileNameTrimmed.endsWith(".pdf")
      ? fileNameTrimmed
      : `${fileNameTrimmed}.pdf`;

    setIsSaving(true);
    try {
      await handleSaveTransactionsAsPDF(finalFileName);
      setErrorMessage("");
      setFileName("");
      handleCloseSaveTransactionModal();
    } catch (error) {
      setErrorMessage(`Failed to save transactions as pdf: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    setErrorMessage("");
    setFileName("");
    handleCloseSaveTransactionModal();
  };

  return (
    <Modal
      show={isSaveTransactionModalVisible}
      onHide={handleCancel}
      centered
      backdrop={isSaving ? "static" : true}
      keyboard={!isSaving}
    >
      <Modal.Header closeButton>
        <Modal.Title>Save transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AppliedFiltersInfo />
        <Form>
          <Form.Group controlId="transactionFileName">
            <Form.Label>File name</Form.Label>
            <Form.Control
              aria-label="File name for saving transactions"
              type="text"
              placeholder="e.g. nov-transactions.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              isInvalid={Boolean(errorMessage)}
              className={`py-1 ${errorMessage ? "shake" : ""}`}
              ref={fileNameRef}
              maxLength={40}
            />
          </Form.Group>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleSaveTransactions}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : (
            "Save as PDF"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveTransactionModal;
