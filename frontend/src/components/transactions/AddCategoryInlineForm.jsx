import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../api/axios";
import TransactionContext from "../../store/context/transactionContext";

function AddCategoryInlineForm() {
  const { showAddCategoryForm, fetchCategoriesFromDB, closeAddCategoryForm } =
    useContext(TransactionContext);
  const [newCategoryName, setNewCategoryName] = useState("");
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

  const handleAddCategory = async () => {
    const newCategoryNameTrimmed = newCategoryName.trim();
    if (!newCategoryName) {
      setVariant("danger");
      setMessage("Please enter a category name.");
      return;
    }
    try {
      await axiosPrivate.post("/user/transactions/categories", {
        name: newCategoryNameTrimmed,
      });
      setVariant("success");
      setMessage(`Category '${newCategoryNameTrimmed}' added successfully.`);
      setNewCategoryName("");
      fetchCategoriesFromDB();
    } catch (error) {
      console.log("Error while adding category:", error);
      setVariant("danger");
      if (!error?.response) {
        setMessage("Failed to adding category: No server response.");
      } else {
        setMessage(error?.response?.data?.error || "Failed to add category.");
      }
    }
  };

  const handleCancel = () => {
    setNewCategoryName("");
    closeAddCategoryForm();
  };

  if (!showAddCategoryForm) return null;

  return (
    <div className="mt-4 mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter new category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button
          variant="success"
          onClick={handleAddCategory}
          title="Add Category"
        >
          Add
        </Button>
        <Button variant="outline-danger" onClick={handleCancel} title="Cancel">
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
