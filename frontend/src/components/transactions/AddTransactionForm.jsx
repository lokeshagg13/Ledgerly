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

function AddTransactionForm() {
  const transactionContext = useContext(TransactionContext);
  const formData = transactionContext.transactionFormData;

  useEffect(() => {
    transactionContext.fetchCategoriesFromDB();
  }, []);

  useEffect(() => {
    transactionContext.fetchSubcategoriesFromDB();
  }, [formData.category]);

  const handleChange = (e) => {
    transactionContext.updateTransactionFormData(e.target.name, e.target.value);
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
            type="number"
            name="amount"
            value={formData.amount}
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
            {transactionContext.isCategoriesLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {transactionContext.categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-primary"
                  onClick={transactionContext.openAddCategoryForm}
                  title="Add New Category"
                >
                  +
                </Button>
              </>
            )}
          </InputGroup>
          <AddCategoryInlineForm />
        </Form.Group>

        {/* Subcategory */}
        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <InputGroup>
            {transactionContext.isSubcategoriesLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <Form.Select
                  name="subcategory"
                  value={formData.subcategory || "null"}
                  onChange={(e) => {
                    const value =
                      e.target.value === "null" ? null : e.target.value;
                    transactionContext.updateTransactionFormData(
                      e.target.name,
                      value
                    );
                  }}
                >
                  <option value="null">None</option>
                  {transactionContext.subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </Form.Select>

                {formData.category ? (
                  <Button
                    variant="outline-primary"
                    onClick={transactionContext.openAddSubcategoryForm}
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
          {formData.category && <AddSubcategoryInlineForm />}
        </Form.Group>
      </Form>
    </>
  );
}

export default AddTransactionForm;
