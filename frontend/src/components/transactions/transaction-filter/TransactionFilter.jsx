import { useState } from "react";
import TransactionFilterSection from "./transaction-filter-section/TransactionFilterSection";
import CaretDownIcon from "../../ui/icons/CaretDownIcon";

function TransactionFilter() {
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);

  return (
    <div className="transaction-filter">
      <div
        className="transaction-filter-header"
        onClick={() => setIsFilterSectionVisible(!isFilterSectionVisible)}
      >
        <h4>Filters</h4>
        <div
          className={`transaction-filter-dropdown ${
            isFilterSectionVisible ? "up" : ""
          }`}
        >
          <CaretDownIcon fill="white" width="1.4em" height="1.4em" />
        </div>
      </div>
      {isFilterSectionVisible && <TransactionFilterSection />}
    </div>
  );
}

export default TransactionFilter;
