import { useContext } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import AddSubcategoryModal from "../subcategory-modals/AddSubcategoryModal";
import SubcategoryContext from "../../../../../store/context/subcategoryContext";

function CategoryRowControl({ categoryId, categoryName }) {
  const { isAddSubcategoryModalVisible, handleOpenAddSubcategoryModal } =
    useContext(SubcategoryContext);
  return (
    <div className="category-row-controls">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-add-${categoryId}`}>
            Add subcategory under <br />
            <b>{categoryName}</b>
          </Tooltip>
        }
      >
        <Button
          className="control-btn btn-blue"
          onClick={handleOpenAddSubcategoryModal}
          aria-label={`Add subcategory under ${categoryName}`}
        >
          Add Subcategory
        </Button>
      </OverlayTrigger>
      {isAddSubcategoryModalVisible && (
        <AddSubcategoryModal
          categoryId={categoryId}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}

export default CategoryRowControl;
