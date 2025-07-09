import { CategoryProvider } from "../../store/context/categoryContext";
import CategoryControl from "./category-control/CategoryControl";
import CategoryTable from "./category-table/CategoryTable";

function CategoryPageContent() {
  return (
    <CategoryProvider>
      <div className="category-page-header">
        <h2>Categories</h2>
      </div>

      <div className="category-page-body-wrapper">
        <div className="category-page-body">
          <CategoryControl />
          <CategoryTable />
        </div>
      </div>
    </CategoryProvider>
  );
}

export default CategoryPageContent;
