import { useContext, useRef, useState } from "react";

import DeleteSubcategoryModal from "../../subcategory-modals/DeleteSubcategoryModal";
import SubcategoryContextMenu from "./subcategory-context-menu/SubcategoryContextMenu";
import SubcategoryNameEditor from "./subcategory-name-editor/SubcategoryNameEditor";
import ContextMenuContext from "../../../../../../store/context/contextMenuContext";

function SubcategoryName({ subcategoryId, subcategoryName }) {
  const {
    checkIfContextMenuVisible,
    handleContextMenuToggle,
    handleCloseContextMenus,
  } = useContext(ContextMenuContext);
  const [isEditorOn, setIsEditorOn] = useState(false);
  const [showDeleteSubcategoryModal, setShowDeleteSubcategoryModal] =
    useState(false);

  const isContextMenuVisible = checkIfContextMenuVisible(
    "subcategory",
    subcategoryId
  );
  const anchorRef = useRef(null);

  const handleRemoveAction = () => {
    setShowDeleteSubcategoryModal(true);
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
    <div className="subcategory-name-wrapper">
      {isEditorOn ? (
        <SubcategoryNameEditor
          subcategoryId={subcategoryId}
          subcategoryName={subcategoryName}
          onClose={handleCloseNameEditor}
        />
      ) : (
        <>
          <button
            type="button"
            ref={anchorRef}
            className="subcategory-name-button"
            onClick={() =>
              handleContextMenuToggle("subcategory", subcategoryId)
            }
            aria-label={`Options for subcategory ${subcategoryName}`}
          >
            {subcategoryName}
          </button>
          {isContextMenuVisible && (
            <SubcategoryContextMenu
              anchor={anchorRef.current}
              show={isContextMenuVisible}
              onHide={handleCloseContextMenus}
              onRename={handleRenameAction}
              onRemove={handleRemoveAction}
            />
          )}
          {showDeleteSubcategoryModal && (
            <DeleteSubcategoryModal
              subcategoryId={subcategoryId}
              subcategoryName={subcategoryName}
              onClose={() => setShowDeleteSubcategoryModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SubcategoryName;
