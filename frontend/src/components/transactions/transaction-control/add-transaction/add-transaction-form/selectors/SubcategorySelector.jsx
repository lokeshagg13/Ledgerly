import { useContext } from "react";
import {
  Button,
  Form,
  InputGroup,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import AddSubcategoryInlineForm from "./inline-forms/AddSubcategoryInlineForm";
import AddIcon from "../../../../../ui/icons/AddIcon";
import CategoryContext from "../../../../../../store/context/categoryContext";
import TransactionContext from "../../../../../../store/context/transactionContext";

function SubcategorySelector({ value, onChange, subcategories }) {
  const { isLoadingSubcategoryMapping } = useContext(CategoryContext);
  const {
    addTransactionFormData,
    isAddSubcategoryFormVisible,
    handleOpenAddSubcategoryForm,
  } = useContext(TransactionContext);

  const selectedCategory = addTransactionFormData.categoryId;
  const isDisabled = !selectedCategory || isLoadingSubcategoryMapping;

  const handleNewSubcategoryAdded = (newSubcategoryId) => {
    onChange({ target: { name: "subcategory", value: newSubcategoryId } });
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Subcategory</Form.Label>
      <InputGroup>
        {isLoadingSubcategoryMapping ? (
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
                onClick={handleOpenAddSubcategoryForm}
                title="Add New Category"
                disabled={isAddSubcategoryFormVisible}
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
      {selectedCategory && isAddSubcategoryFormVisible && (
        <AddSubcategoryInlineForm
          onSubcategoryAdded={handleNewSubcategoryAdded}
        />
      )}
    </Form.Group>
  );
}

export default SubcategorySelector;
