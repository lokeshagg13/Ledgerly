import { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TransactionContext from "../../store/context/transactionContext";
import AddTransactionForm from "./AddTransactionForm";

function AddTransactionModal() {
  const {
    transactionFormData,
    closeAddTransactionModal,
    resetTransactionFormData,
    showAddTransactionModal,
  } = useContext(TransactionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    const { amount, date, type, remarks, category } = transactionFormData;
    if (!amount || !date || !type || !remarks || !category) {
      alert("Please fill all required fields.");
      return;
    }

    handleAddTransaction();
    closeAddTransactionModal();
    resetTransactionFormData();
  };

  return (
    <Modal
      show={showAddTransactionModal}
      onHide={closeAddTransactionModal}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddTransactionForm />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeAddTransactionModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
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
