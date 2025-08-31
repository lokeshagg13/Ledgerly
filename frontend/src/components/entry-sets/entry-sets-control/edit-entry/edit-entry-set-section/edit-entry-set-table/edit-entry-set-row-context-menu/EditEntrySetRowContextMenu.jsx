import { useContext } from "react";
import ContextMenuContext from "../../../../../../../store/context/contextMenuContext";
import EditEntrySetContext from "../../../../../../../store/context/editEntrySetContext";

function EditEntrySetRowContextMenu() {
  const {
    editableEntrySetDataRows,
    clickedEntryRow,
    menuPosition,
    findFirstEmptyRowIndex,
    handleInsertEntryRow,
    handleDeleteEntryRow,
    handleInsertCashEntryRow,
  } = useContext(EditEntrySetContext);
  const { handleCloseContextMenus } = useContext(ContextMenuContext);

  return (
    <div>
      <ul
        className="edit-entry-set-row-context-menu"
        style={{
          top: menuPosition.y,
          left: menuPosition.x,
        }}
        onMouseLeave={handleCloseContextMenus}
      >
        <li
          onClick={() => {
            handleInsertEntryRow(clickedEntryRow);
            handleCloseContextMenus();
          }}
        >
          Insert Row Above
        </li>
        <li
          onClick={() => {
            handleInsertEntryRow(clickedEntryRow + 1);
            handleCloseContextMenus();
          }}
        >
          Insert Row Below
        </li>
        {editableEntrySetDataRows.length > 1 && (
          <li
            className="danger"
            onClick={() => {
              handleDeleteEntryRow(clickedEntryRow);
              handleCloseContextMenus();
            }}
          >
            Delete Row
          </li>
        )}
        <li
          onClick={() => {
            const rowIdx = findFirstEmptyRowIndex();
            handleInsertCashEntryRow(rowIdx);
            handleCloseContextMenus();
          }}
        >
          Insert Cash Entry
        </li>
      </ul>
    </div>
  );
}

export default EditEntrySetRowContextMenu;
