import { useState } from "react";
import TransactionFilters from "./transaction-filters/TransactionFilters";
import CaretDownIcon from "../../ui/icons/CaretDownIcon";

function TransactionFilterSection() {
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);

  return (
    <div className="transaction-filter-section">
      <div
        className="transaction-filter-header"
        onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}
      >
        <h4>Filters</h4>
        <div className={`transaction-filter-dropdown ${isFilterSectionVisible ? "up" : ""}`}>
          <CaretDownIcon fill="white" width="1.4em" height="1.4em" />
        </div>
      </div>
      {isFilterSectionVisible && <TransactionFilters />}
    </div>
  );
}

export default TransactionFilterSection;
