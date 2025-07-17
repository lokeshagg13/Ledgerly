import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { axiosPrivate } from "../../../../../../api/axios";
import TransactionContext from "../../../../../../store/context/transactionContext";
import {
  formatAmountForDisplay,
  formatDateForDisplay,
} from "../../../../../../utils/formatUtils";
import TransactionFilterContext from "../../../../../../store/context/transactionFilterContext";

function DeleteTransactionModal({ transactionId, transactionData, onClose }) {
  const { fetchTransactions } = useContext(TransactionContext);
  const { appliedFilters } = useContext(TransactionFilterContext);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const messageTimeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(messageTimeout);
    }
  }, [errorMessage]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!deleting && e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [deleting]);

  const handleDeleteTransaction = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axiosPrivate.delete(`/user/transactions/${transactionId}`);
      setErrorMessage("");
      onClose();
      fetchTransactions(appliedFilters);
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to delete transaction: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to delete transaction."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (deleting) return;
    setErrorMessage("");
    onClose();
  };

  return (
    <Modal
      id="deleteTransactionModal"
      show={true}
      onHide={handleCancel}
      centered
      backdrop={deleting ? "static" : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete the following transaction.
        </p>
        <div className="delete-transaction-data-wrapper">
          <div className="delete-transaction-data">
            <table className="delete-transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formatDateForDisplay(transactionData.date)}</td>
                  <td>{formatAmountForDisplay(transactionData.amount)}</td>
                  <td>{transactionData.remarks}</td>
                  <td>{transactionData.categoryName}</td>
                  <td>{transactionData.subcategoryName || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="warning-message">Note: This action cannot be undone.</p>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleDeleteTransaction}
          disabled={deleting}
        >
          {deleting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteTransactionModal;
