import { useContext, useRef, useState } from "react";

import DeleteCategoryModal from "../../../category-modals/DeleteCategoryModal";
import CategoryContextMenu from "./category-context-menu/CategoryContextMenu";
import CategoryNameEditor from "./category-name-editor/CategoryNameEditor";
import ContextMenuContext from "../../../../../store/context/contextMenuContext";

function CategoryName({ categoryId, categoryName }) {
  const {
    checkIfContextMenuVisible,
    handleContextMenuToggle,
    handleCloseContextMenus,
  } = useContext(ContextMenuContext);
  const [isEditorOn, setIsEditorOn] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  const isContextMenuVisible = checkIfContextMenuVisible(
    "category",
    categoryId
  );
  const anchorRef = useRef(null);

  const handleRemoveAction = () => {
    setShowDeleteCategoryModal(true);
    handleCloseContextMenus();
  };

  const handleRenameAction = () => {
    setIsEditorOn(true);
    handleCloseContextMenus();
  };

  const handleCloseNameEditor = () => {
    setIsEditorOn(false);
    handleCloseContextMenus();
  };

  return (
    <div className="category-name-wrapper">
      {isEditorOn ? (
        <CategoryNameEditor
          categoryId={categoryId}
          categoryName={categoryName}
          onClose={handleCloseNameEditor}
        />
      ) : (
        <>
          <button
            ref={anchorRef ?? undefined}
            className="category-name-button"
            onClick={() => handleContextMenuToggle("category", categoryId)}
            aria-haspopup="true"
            aria-expanded={isContextMenuVisible}
            aria-label={`Options for category ${categoryName}`}
          >
            {categoryName}
          </button>
          {isContextMenuVisible && (
            <CategoryContextMenu
              anchor={anchorRef.current}
              show={isContextMenuVisible}
              onHide={handleCloseContextMenus}
              onRename={handleRenameAction}
              onRemove={handleRemoveAction}
            />
          )}
          {showDeleteCategoryModal && (
            <DeleteCategoryModal
              categoryId={categoryId}
              categoryName={categoryName}
              onClose={() => setShowDeleteCategoryModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CategoryName;
