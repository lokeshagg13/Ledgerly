import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../api/axios";
import TransactionContext from "../../store/context/transactionContext";

function AddSubcategoryInlineForm() {
  const {
    transactionFormData,
    showAddSubcategoryForm,
    fetchSubcategoriesFromDB,
    closeAddSubcategoryForm,
  } = useContext(TransactionContext);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
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
    const newSubcategoryNameTrimmed = newSubcategoryName.trim();
    if (!categoryId) {
      setVariant("danger");
      setMessage("Select a category first.");
      return;
    }
    if (!newSubcategoryNameTrimmed) {
      setVariant("danger");
      setMessage("Please enter a subcategory name.");
      return;
    }
    try {
      await axiosPrivate.post("/user/transactions/subcategories", {
        name: newSubcategoryNameTrimmed,
        categoryId: categoryId,
      });
      setVariant("success");
      setMessage(
        `Subcategory '${newSubcategoryNameTrimmed}' added successfully.`
      );
      fetchSubcategoriesFromDB();
      setNewSubcategoryName("");
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

  const handleCancel = () => {
    setNewSubcategoryName("");
    closeAddSubcategoryForm();
  };

  if (!showAddSubcategoryForm) return null;

  return (
    <div className="mt-4 mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter new subcategory name"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
        />
        <Button
          variant="success"
          onClick={handleAddSubcategory}
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

export default AddSubcategoryInlineForm;
