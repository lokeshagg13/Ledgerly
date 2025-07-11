import { useContext, useEffect, useState } from "react";
import DateFilters from "./transaction-filters-basic/DateFilters";
import CategoryFilters from "./transaction-filters-basic/CategoryFilters";
import TransactionFilterContext from "../../../../../store/context/transactionFilterContext";

function TransactionFilterInputs() {
  const [isAdvancedFilterSectionVisible, setIsAdvancedFilterSectionVisible] =
    useState(false);

  const { filteringError, resetFilteringError, fetchCategoriesFromDB } =
    useContext(TransactionFilterContext);

  useEffect(() => {
    if (filteringError.errorMessage) {
      const timeout = setTimeout(() => resetFilteringError(), 8000);
      return () => clearTimeout(timeout);
    }
  }, [filteringError]);

  useEffect(() => {
    fetchCategoriesFromDB();
  }, []);

  return (
    <div className="transaction-filter-inputs">
      <div className="transaction-filter-basic">
        <DateFilters />
        <CategoryFilters />
      </div>
      <div className="transaction-filter-advanced">
        <div className="advanced-filter-control">
          <button
            onClick={() =>
              setIsAdvancedFilterSectionVisible(!isAdvancedFilterSectionVisible)
            }
          >
            {isAdvancedFilterSectionVisible ? "Hide" : "Show"} Advanced Filters
          </button>
        </div>
        {isAdvancedFilterSectionVisible && (
          <>
            <p>These are advanced filters</p>
          </>
        )}
      </div>

      {filteringError?.message && (
        <div className="filtering-error-message">{filteringError.message}</div>
      )}
    </div>
  );
}

export default TransactionFilterInputs;
