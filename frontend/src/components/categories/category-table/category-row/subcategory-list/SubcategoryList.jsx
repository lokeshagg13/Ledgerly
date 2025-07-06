import { useContext, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import SubcategoryContext from "../../../../../store/context/subcategoryContext";
import SubcategoryName from "./subcategory-name/SubcategoryName";

function SubcategoryList({ categoryId }) {
  const { subcategories, isLoadingSubcategories, fetchSubcategoriesFromDB } =
    useContext(SubcategoryContext);

  useEffect(() => {
    fetchSubcategoriesFromDB();
    // eslint-disable-next-line
  }, [categoryId]);

  if (isLoadingSubcategories)
    return (
      <div className="subcategory-list-spinner">
        <Spinner animation="border" size="sm" />
      </div>
    );

  if (subcategories.length === 0) {
    return <span className="text-muted">None</span>;
  }

  return (
    <div className="subcategory-list">
      {subcategories.map((sub) => (
        <SubcategoryName
          key={sub._id}
          subcategoryId={sub._id}
          subcategoryName={sub.name}
        />
      ))}
    </div>
  );
}

export default SubcategoryList;
