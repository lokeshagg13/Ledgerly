import { useContext } from "react";
import ContextMenuContext from "../../../../../../../store/context/contextMenuContext";
import NewEntryContext from "../../../../../../../store/context/newEntryContext";

function NewEntryRowContextMenu() {
  const {
    entryDataRows,
    clickedRow,
    menuPos,
    findFirstEmptyRowIndex,
    handleInsertRow,
    handleDeleteRow,
    handleInsertCashEntryRow,
  } = useContext(NewEntryContext);
  const { handleCloseContextMenus } = useContext(ContextMenuContext);

  return (
    <div>
      <ul
        className="new-entry-row-context-menu"
        style={{
          top: menuPos.y,
          left: menuPos.x,
        }}
        onMouseLeave={handleCloseContextMenus}
      >
        <li
          onClick={() => {
            handleInsertRow(clickedRow);
            handleCloseContextMenus();
          }}
        >
          Insert Row Above
        </li>
        <li
          onClick={() => {
            handleInsertRow(clickedRow + 1);
            handleCloseContextMenus();
          }}
        >
          Insert Row Below
        </li>
        {entryDataRows.length > 1 && (
          <li
            className="danger"
            onClick={() => {
              handleDeleteRow(clickedRow);
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

export default NewEntryRowContextMenu;
