import { Overlay, Popover, Button } from "react-bootstrap";
import EditIcon from "../../../../../ui/icons/EditIcon";
import TrashIcon from "../../../../../ui/icons/TrashIcon";

function CategoryContextMenu({ anchor, show, onHide, onRename, onRemove }) {
  return (
    <Overlay
      show={show}
      target={anchor}
      placement="top-end"
      containerPadding={10}
      rootClose
      onHide={onHide}
    >
      <Popover className="category-context-menu">
        <Popover.Body className="category-context-body">
          <Button
            size="sm"
            onClick={onRename}
            className="category-context-button context-rename-button"
            aria-label="Rename category"
            title="Rename"
          >
            <EditIcon width="1em" height="1em" />
          </Button>
          <Button
            size="sm"
            onClick={onRemove}
            className="category-context-button context-remove-button"
            aria-label="Delete category"
            title="Delete"
          >
            <TrashIcon width="1em" height="1em" />
          </Button>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
}

export default CategoryContextMenu;
