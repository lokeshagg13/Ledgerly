import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../api/axios";
import TransactionContext from "../../store/context/transactionContext";

function AddSubcategoryInlineForm() {
  const {
    transactionFormData,
    fetchSubcategoriesFromDB,
    closeAddSubcategoryForm,
  } = useContext(TransactionContext);
  const [newSubcategoryInput, setNewSubcategoryInput] = useState("");
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

  const handleAddSubcategory = async () => {
    const categoryId = transactionFormData.category;
    const newSubcategoryInputTrimmed = newSubcategoryInput.trim();
    if (!categoryId || !newSubcategoryInputTrimmed) return;
    try {
      await axiosPrivate.post("/user/transactions/subcategories", {
        name: newSubcategoryInputTrimmed,
        categoryId: categoryId,
      });
      setVariant("success");
      setMessage(
        `Subcategory '${newSubcategoryInputTrimmed}' added successfully.`
      );
      fetchSubcategoriesFromDB();
      setNewSubcategoryInput("");
    } catch (error) {
      console.log("Error while adding subcategory:", error);
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
          value={newSubcategoryInput}
          onChange={(e) => setNewSubcategoryInput(e.target.value)}
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
          onClick={closeAddSubcategoryForm}
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
