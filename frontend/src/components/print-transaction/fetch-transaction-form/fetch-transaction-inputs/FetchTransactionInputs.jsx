import { useContext } from "react";
import { Form } from "react-bootstrap";

import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import LastNTransactionInput from "./last-n-transaction-input/LastNTransactionInput";
import DateFilters from "./transaction-filter-inputs/DateFilterInputs";
import CategoryFilters from "./transaction-filter-inputs/CategoryFilterInput";

function FetchTransactionInputs() {
  const {
    fetchMode,
    isPrintSectionVisible,
    setFetchMode,
    resetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  const handleModifyFetchMode = (newMode) => {
    if (isPrintSectionVisible) return;
    resetErrorFetchingTransactions();
    setFetchMode(newMode);
  };

  return (
    <div className="fetch-transaction-inputs">
      <Form.Check
        type="radio"
        label={<LastNTransactionInput />}
        checked={fetchMode === "recent"}
        onChange={() => handleModifyFetchMode("recent")}
        className="last-n-transaction-radio"
        disabled={isPrintSectionVisible}
      />
      <div className="fetch-transaction-filter-option">
        <Form.Check
          type="radio"
          label={<div className="transaction-filter-label">Custom Filter</div>}
          checked={fetchMode === "filtered"}
          onChange={() => handleModifyFetchMode("filtered")}
          className="transaction-filter-radio"
          disabled={isPrintSectionVisible}
        />
        {fetchMode === "filtered" && (
          <div className="transaction-filter-form">
            <DateFilters />
            <CategoryFilters />
          </div>
        )}
      </div>
    </div>
  );
}

export default FetchTransactionInputs;
