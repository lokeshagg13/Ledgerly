import { useContext } from "react";
import MultiSelector from "../../../../../../ui/elements/MultiSelector";
import DashboardContext from "../../../../../../../store/context/dashboardContext";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";

function CategoryFilterInput() {
  const {
    categories,
    filterFormData,
    modifyFilterFormData,
    resetErrorFetchingFilteredBalance,
  } = useContext(DashboardContext);

  if (categories === null) return;

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const handleCategorySelect = (newValue) => {
    resetErrorFetchingFilteredBalance();
    modifyFilterFormData("selectedCategories", newValue);
  };

  return (
    <div className="balance-filter category-filter-section">
      <div className="category-filter-selector-wrapper">
        <MultiSelector
          className="category-filter-selector"
          label="Select Categories"
          name="categoryFilter"
          options={categoryOptions}
          value={filterFormData.selectedCategories}
          onChange={handleCategorySelect}
          paddedDropdown={true}
        />
        {Array.isArray(filterFormData.selectedCategories) &&
          filterFormData.selectedCategories.length > 0 && (
            <button
              type="button"
              className="clear-categories-button"
              onClick={() => modifyFilterFormData("selectedCategories", [])}
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
