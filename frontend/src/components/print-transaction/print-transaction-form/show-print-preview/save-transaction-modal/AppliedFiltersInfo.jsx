import { useContext } from "react";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";
import { formatCategoryNamesUsingCategoryIds } from "../../../../../utils/formatUtils";

function AppliedFiltersInfo() {
  const {
    fetchMode,
    lastN,
    fromDate,
    toDate,
    categories,
    selectedCategories,
    printStyle,
  } = useContext(TransactionPrintContext);

  return (
    <div className="applied-filters-box">
      <h6>Applied Filters</h6>
      <ul>
        <li>
          <strong>Mode:</strong>{" "}
          {fetchMode === "recent"
            ? "Recent Transactions"
            : "Filtered Transactions"}
        </li>
        {fetchMode === "recent" && (
          <li>
            <strong>Count:</strong> Last {lastN} transactions
          </li>
        )}
        {fetchMode === "filtered" && (
          <>
            {fromDate && (
              <li>
                <strong>From Date:</strong>{" "}
                {new Date(fromDate).toLocaleDateString()}
              </li>
            )}
            {toDate && (
              <li>
                <strong>To Date:</strong>{" "}
                {new Date(toDate).toLocaleDateString()}
              </li>
            )}
            {selectedCategories?.length > 0 && (
              <li>
                <strong>Categories:</strong>{" "}
                {formatCategoryNamesUsingCategoryIds(
                  categories,
                  selectedCategories
                )}
              </li>
            )}
          </>
        )}
        <li>
          <strong>Print Style:</strong>{" "}
          {printStyle === "ca" ? "CA Format" : "Table Format"}
        </li>
      </ul>
    </div>
  );
}

export default AppliedFiltersInfo;
