import { useContext, useEffect } from "react";
import {
  Button,
  Form,
  Spinner,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import TransactionContext from "../../store/context/transactionContext";
import AddCategoryInlineForm from "./AddCategoryInlineForm";
import AddSubcategoryInlineForm from "./AddSubcategoryInlineForm";
import { formatAmountWithCommas } from "../../logic/utils";

function AddTransactionForm() {
  const {
    transactionFormData: formData,
    showAddCategoryForm,
    showAddSubcategoryForm,
    categories,
    isLoadingCategories,
    subcategories,
    isLoadingSubcategories,
    fetchCategoriesFromDB,
    fetchSubcategoriesFromDB,
    updateTransactionFormData,
    openAddCategoryForm,
    openAddSubcategoryForm,
  } = useContext(TransactionContext);

  useEffect(() => {
    fetchCategoriesFromDB();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchSubcategoriesFromDB();
    // eslint-disable-next-line
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        if (isValid || rawValue === "") {
          updateTransactionFormData(name, rawValue);
        }
        break;
      case "subcategory":
        const newValue = value === "null" ? null : value;
        updateTransactionFormData(name, newValue);
        break;
      default:
        updateTransactionFormData(e.target.name, e.target.value);
    }
  };

  return (
    <>
      <Form>
        {/* Type */}
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Form.Select>
        </Form.Group>

        {/* Amount */}
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="text"
            name="amount"
            value={
              formData.amount !== ""
                ? formatAmountWithCommas(formData.amount)
                : ""
            }
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </Form.Group>

        {/* Date */}
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Remarks */}
        <Form.Group className="mb-3">
          <Form.Label>Remarks</Form.Label>
          <Form.Control
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            required
          />
        </Form.Group>

        {/* Category */}
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <InputGroup>
            {isLoadingCategories ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                  onClick={openAddCategoryForm}
                  title="Add New Category"
                >
                  +
                </Button>
              </>
            )}
          </InputGroup>
          {showAddCategoryForm && <AddCategoryInlineForm />}
        </Form.Group>

        {/* Subcategory */}
        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <InputGroup>
            {isLoadingSubcategories ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <Form.Select
                  name="subcategory"
                  value={formData.subcategory || "null"}
                  onChange={handleChange}
                >
                  <option value="null">None</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </Form.Select>

                {formData.category ? (
                  <Button
                    variant="outline-primary"
                    onClick={openAddSubcategoryForm}
                    title="Add New Category"
                  >
                    +
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
                      disabled={true}
                      style={{ pointerEvents: "auto" }}
                    >
                      +
                    </Button>
                  </OverlayTrigger>
                )}
              </>
            )}
          </InputGroup>
          {formData.category && showAddSubcategoryForm && (
            <AddSubcategoryInlineForm />
          )}
        </Form.Group>
      </Form>
    </>
  );
}

export default AddTransactionForm;
