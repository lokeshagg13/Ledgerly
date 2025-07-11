import { useContext } from "react";
import { Button } from "react-bootstrap";

import TransactionFilterContext from "../../../../../store/context/transactionFilterContext";

function TransactionFilterControl() {
  const { applyFilters, clearFilters } = useContext(TransactionFilterContext);

  return (
    <div className="transaction-filter-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Apply filters"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Clear filters"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}

export default TransactionFilterControl;
