import { useContext, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TransactionContext from "../../store/context/transactionContext";
import { formatAmountWithCommas } from "../../logic/utils";
import CategorySelector from "./CategorySelector";
import SubcategorySelector from "./SubcategorySelector";

function AddTransactionForm() {
  const {
    transactionFormData: formData,
    fetchCategoriesFromDB,
    fetchSubcategoriesFromDB,
    updateTransactionFormData,
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
        updateTransactionFormData(name, value || null);
        break;
      default:
        updateTransactionFormData(e.target.name, e.target.value);
    }
  };

  return (
    <Form className="transaction-form">
      {/* Type */}
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
          name="type"
          id="transactionType"
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
        <InputGroup>
          <InputGroup.Text>₹</InputGroup.Text>
          <Form.Control
            type="text"
            name="amount"
            id="transactionAmount"
            value={
              formData.amount !== ""
                ? formatAmountWithCommas(formData.amount)
                : ""
            }
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </InputGroup>
      </Form.Group>

      {/* Date */}
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          id="transactionDate"
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
          id="transactionRemarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Remarks"
          required
        />
      </Form.Group>

      {/* Category */}
      <CategorySelector value={formData.category} onChange={handleChange} />

      {/* Subcategory */}
      <SubcategorySelector
        value={formData.subcategory}
        onChange={handleChange}
      />
    </Form>
  );
}

export default AddTransactionForm;
