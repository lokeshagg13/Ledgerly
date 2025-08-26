import { useContext } from "react";
import ContextMenuContext from "../../../../../../../store/context/contextMenuContext";
import NewEntrySetContext from "../../../../../../../store/context/newEntrySetContext";

function NewEntrySetRowContextMenu() {
  const {
    entrySetDataRows,
    clickedEntryRow,
    menuPosition,
    findFirstEmptyRowIndex,
    handleInsertEntryRow,
    handleDeleteEntryRow,
    handleInsertCashEntryRow,
  } = useContext(NewEntrySetContext);
  const { handleCloseContextMenus } = useContext(ContextMenuContext);

  return (
    <div>
      <ul
        className="new-entry-set-row-context-menu"
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
        {entrySetDataRows.length > 1 && (
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

export default NewEntrySetRowContextMenu;
