import { useContext } from "react";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import AddSubcategoryInlineForm from "./AddSubcategoryInlineForm";
import TransactionContext from "../../store/context/transactionContext";
import AddIcon from "../ui/icons/AddIcon";

function SubcategorySelector({ value, onChange }) {
  const {
    transactionFormData,
    subcategories,
    isLoadingSubcategories,
    showAddSubcategoryForm,
    openAddSubcategoryForm,
  } = useContext(TransactionContext);

  const selectedCategory = transactionFormData.category;
  const isDisabled = !selectedCategory || isLoadingSubcategories;

  return (
    <Form.Group className="mb-3">
      <Form.Label>Subcategory</Form.Label>
      <InputGroup>
        {isLoadingSubcategories ? (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        ) : (
          <>
            <Form.Select
              name="subcategory"
              aria-label="Select subcategory"
              value={value ?? ""}
              onChange={onChange}
              disabled={isDisabled}
            >
              <option value="">None</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </Form.Select>

            {selectedCategory ? (
              <Button
                variant="outline-primary"
                aria-label="Add new subcategory"
                onClick={openAddSubcategoryForm}
                title="Add New Category"
                disabled={showAddSubcategoryForm}
              >
                <AddIcon />
              </Button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="add-sub-tooltip">
                    Select a category first
                  </Tooltip>
                }
              >
                <Button
                  variant="outline-primary"
                  title="Add New Subcategory"
                  disabled
                  className="btn-disabled"
                >
                  <AddIcon />
                </Button>
              </OverlayTrigger>
            )}
          </>
        )}
      </InputGroup>
      {selectedCategory && showAddSubcategoryForm && (
        <AddSubcategoryInlineForm />
      )}
    </Form.Group>
  );
}

export default SubcategorySelector;
