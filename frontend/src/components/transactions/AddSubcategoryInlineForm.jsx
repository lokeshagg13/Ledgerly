import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../api/axios";
import TransactionContext from "../../store/context/transactionContext";

function AddSubcategoryInlineForm() {
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

  if (!transactionContext.showAddSubcategoryForm) return null;

  const handleAddSubcategory = async () => {
    const categoryId = transactionContext.transactionFormData.category;
    const newSubcategoryInput = transactionContext.newSubcategoryInput.trim();
    if (!categoryId || !newSubcategoryInput) return;

    try {
      await axiosPrivate.post("/user/transactions/subcategories", {
        name: newSubcategoryInput,
        categoryId: categoryId,
      });
      setVariant("success");
      setMessage(`Subcategory '${newSubcategoryInput}' added successfully.`);
      transactionContext.fetchSubcategoriesFromDB();
      transactionContext.setNewSubcategoryInput("");
    } catch (error) {
      console.log(error);
      setVariant("danger");
      if (!error?.response) {
        setMessage("Failed to adding subcategory: No server response.");
      } else {
        setMessage(
          error?.response?.data?.error || "Failed to add subcategory."
        );
      }
    }
  };

  return (
    <div className="mt-4 mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter new subcategory name"
          value={transactionContext.newSubcategoryInput}
          onChange={(e) =>
            transactionContext.setNewSubcategoryInput(e.target.value)
          }
        />
        <Button
          variant="success"
          onClick={handleAddSubcategory}
          title="Add Category"
        >
          Add
        </Button>
        <Button
          variant="outline-danger"
          onClick={transactionContext.closeAddSubcategoryForm}
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

export default AddSubcategoryInlineForm;
