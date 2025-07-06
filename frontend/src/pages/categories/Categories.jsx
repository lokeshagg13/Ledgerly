import { CategoryProvider } from "../../store/context/categoryContext";
import CategoryControl from "../../components/categories/category-control/CategoryControl";
import CategoryTable from "../../components/categories/category-table/CategoryTable";

function Categories() {
  return (
    <CategoryProvider>
      <div className="page categories-page">
        <div className="categories-header">
          <h2>Categories</h2>
        </div>

        <div className="categories-body-wrapper">
          <div className="categories-body">
            <CategoryControl />
            <CategoryTable />
          </div>
        </div>
      </div>
    </CategoryProvider>
  );
}

export default Categories;
