import { useContext } from "react";
import MultiSelector from "../../../../ui/elements/MultiSelector";
import TransactionPrintContext from "../../../../../store/context/transactionPrintContext";
import CategoryContext from "../../../../../store/context/categoryContext";

function CategoryFilterInput() {
  const { isLoadingCategories, categories } = useContext(CategoryContext);
  const {
    selectedCategories,
    isPrintSectionVisible,
    setSelectedCategories,
    handleResetErrorFetchingTransactions,
  } = useContext(TransactionPrintContext);

  if (categories === null) return;

  // Transform to format suitable for MultiSelector
  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const handleCategorySelect = (newValue) => {
    if (isPrintSectionVisible) return;
    handleResetErrorFetchingTransactions();
    setSelectedCategories(newValue);
  };

  return (
    <div className="category-filter-section">
      <div className="category-filter-selector-wrapper">
        {isLoadingCategories ? (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <MultiSelector
            className="category-filter-selector"
            label="Select Categories"
            name="categoryFilter"
            options={categoryOptions}
            value={selectedCategories}
            onChange={handleCategorySelect}
            disabled={isPrintSectionVisible}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryFilterInput;
