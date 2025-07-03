import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import TransactionContext from "../../store/context/transactionContext";
import AddTransactionForm from "./AddTransactionForm";

function AddTransactionModal() {
  const transactionContext = useContext(TransactionContext);

  const handleSubmit = () => {
    transactionContext.handleAddTransaction();
    transactionContext.closeAddTransactionModal();
    transactionContext.resetTransactionFormData();
  };

  return (
    <Modal
      show={transactionContext.showAddTransactionModal}
      onHide={transactionContext.closeAddTransactionModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddTransactionForm />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={transactionContext.closeAddTransactionModal}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Transaction
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTransactionModal;
