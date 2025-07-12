import { useContext } from "react";
import MultiSelector from "../../../ui/MultiSelector";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";

function CategoryFilterInput() {
  const { categories, selectedCategories, setSelectedCategories } = useContext(
    TransactionPrintContext
  );

  if (categories === null) return;

  // Transform to format suitable for MultiSelector
  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  return (
    <div className="category-filter-section">
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

export default CategoryFilterInput;
