import { useContext } from "react";
import MultiSelector from "../../../../../ui/elements/MultiSelector";
import CategoryContext from "../../../../../../store/context/categoryContext";
import TransactionFilterContext from "../../../../../../store/context/transactionFilterContext";

function CategoryFilters() {
  const { categories } = useContext(CategoryContext);
  const { selectedCategories, setSelectedCategories } = useContext(
    TransactionFilterContext
  );

  if (categories === null) return;

  // Transform to format suitable for MultiSelector
  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  return (
    <div className="category-filter-section">
      <div className="category-filter-heading">
        <h5>Filter by Categories</h5>
      </div>
      <div className="category-filter-selector-wrapper">
        <MultiSelector
          className="category-filter-selector"
          label="Select Categories"
          name="categoryFilter"
          options={categoryOptions}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>
    </div>
  );
}

export default CategoryFilters;
