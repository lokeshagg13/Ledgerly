import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { axiosPrivate } from "../../../api/axios";
import TransactionContext from "../../../store/context/transactionContext";
import AddTransactionForm from "./add-transaction-form/AddTransactionForm";

function AddTransactionModal() {
  const {
    transactionFormData,
    closeAddTransactionModal,
    resetTransactionFormData,
    showAddTransactionModal,
    updateInputFieldErrors,
  } = useContext(TransactionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState("");

  // For hiding error message after 4 seconds
  useEffect(() => {
    if (commonErrorMessage) {
      const timeout = setTimeout(() => {
        setCommonErrorMessage("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [commonErrorMessage, setCommonErrorMessage]);

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    if (!showAddTransactionModal) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeAddTransactionModal();
      }
      if (e.key === "Enter" && !isSubmitting) {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [showAddTransactionModal, isSubmitting, closeAddTransactionModal]);

  const validateTransactionFormData = () => {
    const { amount, date, type, remarks, category } = transactionFormData;
    const errors = {};

    // Validate amount field
    if (!amount) errors.amount = "Amount is required.";
    else if (isNaN(amount) || Number(amount) <= 0)
      errors.amount = "Amount must be a positive number.";
    else if (Number(amount) > Number.MAX_SAFE_INTEGER)
      errors.amount = "Amount exceeds the maximum allowed value.";
    // Validate type
    if (!type) errors.type = "Type is required.";
    else if (!["credit", "debit"].includes(type))
      errors.type = "Transaction type must be either credit or debit.";
    // Validate date
    if (!date) errors.date = "Date is required.";
    else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to start of day
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.date = "Transaction date is invalid.";
      }
    }
    // Validate remarks
    if (!remarks || remarks.trim() === "")
      errors.remarks = "Remarks are required.";
    else if (remarks.length > 50) {
      errors.remarks = "Remarks must be max. 50 characters long.";
    }
    // Validate category
    if (!category)
      errors.category = "Category is required. Please select a valid category.";

    return errors;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const errors = validateTransactionFormData();
    updateInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { amount, date, type, remarks, category, subcategory } =
      transactionFormData;
    setIsSubmitting(true);
    try {
      await axiosPrivate.post("/user/transactions", {
        type,
        amount,
        date,
        remarks,
        categoryId: category,
        subcategoryId: subcategory,
      });
      resetTransactionFormData();
      closeAddTransactionModal();
    } catch (error) {
      console.log("Error while adding transaction:", error);
      if (!error?.response) {
        setCommonErrorMessage("Failed to add transaction: No server response.");
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Failed to add transaction."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={showAddTransactionModal}
      onHide={closeAddTransactionModal}
      centered
      size="lg"
      className="add-transaction-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddTransactionForm />
        {commonErrorMessage && (
          <div className="error-message" aria-live="assertive">
            {commonErrorMessage}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="secondary"
          onClick={closeAddTransactionModal}
        >
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleSubmit}>
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding...
            </>
          ) : (
            "Add Transaction"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTransactionModal;
