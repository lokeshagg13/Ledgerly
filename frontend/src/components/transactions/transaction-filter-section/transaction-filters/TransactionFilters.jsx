import { useState } from "react";
import DateFilters from "./DateFilters";

function TransactionFilters() {
  const [isAdvancedFilterSectionVisible, setIsAdvancedFilterSectionVisible] =
    useState(false);

  return (
    <div className="transaction-filters">
      This is basic filter section.
      <DateFilters />
      <button
        onClick={() =>
          setIsAdvancedFilterSectionVisible(!isAdvancedFilterSectionVisible)
        }
      >
        {isAdvancedFilterSectionVisible ? "Show" : "Hide"} Advanced Filters
      </button>
      {isAdvancedFilterSectionVisible && (
        <>
          <p>These are advanced filters</p>
        </>
      )}
    </div>
  );
}

export default TransactionFilters;
