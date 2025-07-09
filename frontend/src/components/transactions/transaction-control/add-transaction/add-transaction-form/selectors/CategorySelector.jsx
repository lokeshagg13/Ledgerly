import { useContext } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import AddCategoryInlineForm from "./inline-forms/AddCategoryInlineForm";
import TransactionContext from "../../../../../../store/context/transactionContext";
import AddIcon from "../../../../../ui/icons/AddIcon";

function CategorySelector({ value, onChange }) {
  const {
    categories,
    isLoadingCategories,
    showAddCategoryForm,
    inputFieldErrors,
    openAddCategoryForm,
    checkIfInputFieldInvalid,
  } = useContext(TransactionContext);
  return (
    <Form.Group className="mb-3">
      <Form.Label>Category</Form.Label>
      <InputGroup>
        {isLoadingCategories ? (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        ) : (
          <>
            <Form.Select
              name="category"
              aria-label="Select category"
              value={value}
              onChange={onChange}
              disabled={isLoadingCategories}
              isInvalid={checkIfInputFieldInvalid("category")}
              className={checkIfInputFieldInvalid("category") ? "shake" : ""}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="outline-primary"
              aria-label="Add new category"
              onClick={openAddCategoryForm}
              title="Add New Category"
              disabled={showAddCategoryForm}
            >
              <AddIcon />
            </Button>
          </>
        )}
      </InputGroup>
      {checkIfInputFieldInvalid("category") && (
        <div className="text-danger">{inputFieldErrors.category}</div>
      )}
      {showAddCategoryForm && <AddCategoryInlineForm />}
    </Form.Group>
  );
}

export default CategorySelector;
