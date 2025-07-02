import { useContext, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import axios from "axios";
import TransactionContext from "../../store/context/transactionContext";

function AddTransactionForm() {
  const transactionContext = useContext(TransactionContext);
  const [loading, setLoading] = useState(false);

  const formData = transactionContext.formData;

  useEffect(() => {
    setLoading(true);
    axios
      .get("/transaction/categories")
      .then((res) => transactionContext.updateCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    transactionContext.updateFormData(e.target.name, e.target.value);
  };

  return (
    <Form>
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
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
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
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>Subcategory</Form.Label>
        <Form.Control
          type="text"
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleChange}
          placeholder="(Optional) Subcategory ID"
        />
      </Form.Group>
    </Form>
  );
}

export default AddTransactionForm;
