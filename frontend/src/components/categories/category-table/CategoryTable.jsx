import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";

import CategoryContext from "../../../store/context/categoryContext";
import CategoryRow from "./category-row/CategoryRow";
import { ContextMenuProvider } from "../../../store/context/contextMenuContext";

function CategoryTable() {
  const { isLoadingCategories, categories } = useContext(CategoryContext);

  if (isLoadingCategories) {
    return (
      <div className="category-table-loading">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="category-table-empty text-muted">
        No categories added yet.
      </div>
    );
  }

  return (
    <div className="category-table-wrapper">
      <Table
        className="category-table"
        borderless
        aria-label="User category list with subcategories"
      >
        <thead>
          <tr>
            <th></th>
            <th scope="col">Category</th>
            <th scope="col">Subcategories</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <ContextMenuProvider>
            {categories.map((cat) => (
              <CategoryRow
                key={cat._id}
                categoryId={cat._id}
                categoryName={cat.name}
              />
            ))}
          </ContextMenuProvider>
        </tbody>
      </Table>
    </div>
  );
}

export default CategoryTable;
