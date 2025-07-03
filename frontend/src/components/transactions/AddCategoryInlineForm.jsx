import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../api/axios";
import TransactionContext from "../../store/context/transactionContext";

function AddCategoryInlineForm() {
  const transactionContext = useContext(TransactionContext);
  const [variant, setVariant] = useState("success");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const messageTimeout = setTimeout(() => {
        setMessage(null);
      }, 4000);

      return () => clearTimeout(messageTimeout);
    }
  }, [variant, message]);

  if (!transactionContext.showAddCategoryForm) return null;

  const handleAddCategory = async () => {
    const newCategoryInput = transactionContext.newCategoryInput.trim();
    if (!newCategoryInput) return;

    try {
      await axiosPrivate.post("/user/transactions/categories", {
        name: newCategoryInput,
      });

      setVariant("success");
      setMessage(`Category '${newCategoryInput}' added successfully.`);
      transactionContext.fetchCategoriesFromDB();
      transactionContext.setNewCategoryInput("");
    } catch (error) {
      console.log(error);
      setVariant("danger");
      if (!error?.response) {
        setMessage("Failed to adding category: No server response.");
      } else {
        setMessage(error?.response?.data?.error || "Failed to add category.");
      }
    }
  };

  return (
    <div className="mt-4 mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter new category name"
          value={transactionContext.newCategoryInput}
          onChange={(e) =>
            transactionContext.setNewCategoryInput(e.target.value)
          }
        />
        <Button
          variant="success"
          onClick={handleAddCategory}
          title="Add Category"
        >
          Add
        </Button>
        <Button
          variant="outline-danger"
          onClick={transactionContext.closeAddCategoryForm}
          title="Cancel"
        >
          ✕
        </Button>
      </InputGroup>
      {message && (
        <Alert variant={variant} className="py-1 mt-2 mb-0">
          {message}
        </Alert>
      )}
    </div>
  );
}

export default AddCategoryInlineForm;
