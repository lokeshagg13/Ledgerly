import { useContext } from "react";
import { Form } from "react-bootstrap";

import CategoryContext from "../../../../store/context/categoryContext";
import { SubcategoryProvider } from "../../../../store/context/subcategoryContext";

import CategoryRowControl from "./category-row-control/CategoryRowControl";
import SubcategoryList from "./subcategory-list/SubcategoryList";
import CategoryName from "./category-name/CategoryName";

function CategoryRow({ categoryId, categoryName }) {
  const { selectedCategories, handleToggleCategorySelection } =
    useContext(CategoryContext);

  return (
    <SubcategoryProvider categoryId={categoryId}>
      <tr>
        <td>
          <Form.Check
            type="checkbox"
            className="category-checkbox"
            id={`category-checkbox-${categoryId}`}
            checked={selectedCategories.includes(categoryId)}
            onChange={() => handleToggleCategorySelection(categoryId)}
            aria-label={`Select category ${categoryName}`}
          />
        </td>
        <td>
          <CategoryName categoryId={categoryId} categoryName={categoryName} />
        </td>
        <td>
          <SubcategoryList categoryId={categoryId} />
        </td>
        <td>
          <CategoryRowControl
            categoryId={categoryId}
            categoryName={categoryName}
          />
        </td>
      </tr>
    </SubcategoryProvider>
  );
}

export default CategoryRow;
