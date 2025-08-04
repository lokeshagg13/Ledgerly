import { useContext } from "react";
import { Button } from "react-bootstrap";

import TransactionFilterContext from "../../../../../store/context/transactionFilterContext";

function TransactionFilterControl() {
  const { handleApplyFilters, handleClearFilters } = useContext(TransactionFilterContext);

  return (
    <div className="transaction-filter-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Apply filters"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Clear filters"
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );
}

export default TransactionFilterControl;
