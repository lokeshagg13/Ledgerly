import { useContext } from "react";
import MultiSelector from "../../../../../../ui/elements/MultiSelector";
import DashboardContext from "../../../../../../../store/context/dashboardContext";

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
    <div className="category-filter-section">
      <div className="category-filter-selector-wrapper">
        <MultiSelector
          className="category-filter-selector"
          label="Select Categories"
          name="categoryFilter"
          options={categoryOptions}
          value={filterFormData.selectedCategories}
          onChange={handleCategorySelect}
        />
      </div>
    </div>
  );
}

export default CategoryFilterInput;
