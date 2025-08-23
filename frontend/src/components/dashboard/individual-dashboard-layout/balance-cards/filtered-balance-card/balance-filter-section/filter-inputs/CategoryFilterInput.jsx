import { useContext } from "react";
import MultiSelector from "../../../../../../ui/elements/MultiSelector";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";
import CategoryContext from "../../../../../../../store/context/categoryContext";
import IndividualDashboardContext from "../../../../../../../store/context/individualDashboardContext";

function CategoryFilterInput() {
  const { isLoadingCategories, categories } = useContext(CategoryContext);
  const {
    filterFormData,
    handleModifyFilterFormData,
    handleResetErrorFetchingFilteredBalance,
  } = useContext(IndividualDashboardContext);

  if (categories === null) return;

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const handleCategorySelect = (newValue) => {
    handleResetErrorFetchingFilteredBalance();
    handleModifyFilterFormData("selectedCategories", newValue);
  };

  return (
    <div className="balance-filter category-filter-section">
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
            value={filterFormData.selectedCategories}
            onChange={handleCategorySelect}
            paddedDropdown={true}
          />
        )}
        {Array.isArray(filterFormData.selectedCategories) &&
          filterFormData.selectedCategories.length > 0 && (
            <button
              type="button"
              className="clear-categories-button"
              onClick={() => handleModifyFilterFormData("selectedCategories", [])}
              aria-label="Clear selected categories"
            >
              <CancelIcon />
            </button>
          )}
      </div>
    </div>
  );
}

export default CategoryFilterInput;
