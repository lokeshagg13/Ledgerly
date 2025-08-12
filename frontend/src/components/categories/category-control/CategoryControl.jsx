import { useContext } from "react";
import { Button } from "react-bootstrap";
import CategoryContext from "../../../store/context/categoryContext";
import AddCategoryModal from "../category-modals/AddCategoryModal";
import DeleteSelectedCategoriesModal from "../category-modals/DeleteSelectedCategoriesModal";

function CategoryControl() {
  const {
    isLoadingCategories,
    isAddCategoryModalVisible,
    isDeleteSelectedCategoriesModalVisible,
    selectedCategories,
    handleOpenAddCategoryModal,
    handleOpenDeleteSelectedCategoriesModal,
    fetchCategoriesFromDB,
  } = useContext(CategoryContext);

  return (
    <div className="category-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new category"
        onClick={handleOpenAddCategoryModal}
        disabled={isLoadingCategories}
      >
        Add Category
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Delete selected categories"
        onClick={handleOpenDeleteSelectedCategoriesModal}
        disabled={selectedCategories.length === 0}
      >
        Delete Selected <br />
        Categories
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload categories"
        onClick={() => fetchCategoriesFromDB(true)}
        disabled={isLoadingCategories}
        title="Click to reload your categories"
      >
        {isLoadingCategories ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Refreshing...
          </>
        ) : (
          "Refresh Categories"
        )}
      </Button>
      {isAddCategoryModalVisible && <AddCategoryModal />}
      {isDeleteSelectedCategoriesModalVisible && (
        <DeleteSelectedCategoriesModal />
      )}
    </div>
  );
}

export default CategoryControl;
